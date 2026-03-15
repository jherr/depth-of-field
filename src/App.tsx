import { useState, useMemo } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  Flex,
  Text,
  Select,
  Button,
  Radio,
  Stack,
  RadioGroup,
  Icon,
  Wrap,
  WrapItem,
  Divider,
  SimpleGrid,
  Badge,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { TbRuler, TbAperture, TbZoomIn, TbUser } from "react-icons/tb";
import { FiGithub, FiCamera, FiSun, FiMoon } from "react-icons/fi";
import { toImperial, toMetric } from "./utils/units";

import PhotographyGraphic, { SUBJECTS } from "./PhotographyGraphic";

import Telephoto from "./assets/100-400.png";
import Fisheye from "./assets/fishey.png";

const CIRCLES_OF_CONFUSION: Record<
  string,
  {
    coc: number;
    sensorHeight: number;
    cropFactor: number;
  }
> = {
  Webcam: {
    coc: 0.002,
    sensorHeight: 3.6,
    cropFactor: 9.6 
  },
  Smartphone: {
    coc: 0.002,
    sensorHeight: 7.3,
    cropFactor: 6.1
  },
  "35mm (full frame)": {
    coc: 0.029,
    sensorHeight: 24,
    cropFactor: 1.0
  },
  "APS-C": {
    coc: 0.019,
    sensorHeight: 15.6,
    cropFactor: 1.52
  },
  "Micro Four Thirds": {
    coc: 0.015,
    sensorHeight: 13,
    cropFactor: 2.0
  },
  "6x6 (Medium Format)": {
    coc: 0.02,
    sensorHeight: 60,
    cropFactor: 0.55
  },
  "6x7 (Medium Format)": {
    coc: 0.025,
    sensorHeight: 70,
    cropFactor: 0.47
  },
};

const COMMON_SETUPS: {
  name: string;
  focalLength: number;
  aperture: number;
  idealDistance: number;
  sensor: string;
}[] = [
  {
    name: "Webcam",
    focalLength: 3.6,
    aperture: 2.8,
    idealDistance: 36,
    sensor: "Webcam",
  },
  {
    name: "Smartphone",
    focalLength: 4.3,
    aperture: 2.0,
    idealDistance: 36,
    sensor: "Smartphone",
  },
  {
    name: "APS-C - 35mm",
    focalLength: 35,
    aperture: 1.8,
    idealDistance: 72,
    sensor: "APS-C",
  },
  {
    name: "FF - 28mm",
    focalLength: 28,
    aperture: 1.4,
    idealDistance: 48,
    sensor: "35mm (full frame)",
  },
  {
    name: "FF - 35mm",
    focalLength: 35,
    aperture: 1.4,
    idealDistance: 60,
    sensor: "35mm (full frame)",
  },
  {
    name: "FF - 50mm",
    focalLength: 50,
    aperture: 1.8,
    idealDistance: 72,
    sensor: "35mm (full frame)",
  },
  {
    name: "FF - 70mm",
    focalLength: 70,
    aperture: 2.8,
    idealDistance: 96,
    sensor: "35mm (full frame)",
  },
  {
    name: "6x6 - 80mm",
    focalLength: 80,
    aperture: 2.8,
    idealDistance: 90,
    sensor: "6x6 (Medium Format)",
  },
  {
    name: "6x7 - 80mm",
    focalLength: 80,
    aperture: 2.8,
    idealDistance: 80,
    sensor: "6x7 (Medium Format)",
  },
];

const SYSTEMS = ["Metric", "Imperial"] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function App() {
  const [distanceToSubjectInInches, setDistanceToSubjectInInches] =
    useState(72);
  const [focalLengthInMillimeters, setFocalLengthInMillimeters] = useState(50);
  const [aperture, setAperture] = useState(1.8);
  const [subject, setSubject] = useState("Human");
  const [system, setSystem] = useState<(typeof SYSTEMS)[number]>("Imperial");
  const [sensor, setSensor] = useState("35mm (full frame)");
  const [customSensorWidth, setCustomSensorWidth] = useState(36);
const [customSensorHeight, setCustomSensorHeight] = useState(24);

  const { colorMode, toggleColorMode } = useColorMode();

  const convertUnits = system === "Imperial" ? toImperial : toMetric;

  const distanceToSubjectInMM = distanceToSubjectInInches * 25.4;

  const isCustomSensor = sensor === "Custom";
const customCocCalculated = Math.sqrt(customSensorWidth ** 2 + customSensorHeight ** 2) / 1500;
const circleOfConfusionInMillimeters = isCustomSensor
  ? customCocCalculated
  : CIRCLES_OF_CONFUSION[sensor].coc;
const cropFactor = isCustomSensor
  ? 43.27 / Math.sqrt(customSensorWidth ** 2 + customSensorHeight ** 2)
  : CIRCLES_OF_CONFUSION[sensor].cropFactor;

  const hyperFocalDistanceInMM =
    focalLengthInMillimeters +
    (focalLengthInMillimeters * focalLengthInMillimeters) /
      (aperture * circleOfConfusionInMillimeters);
  const depthOfFieldFarLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM -
      (distanceToSubjectInMM - focalLengthInMillimeters));
  const depthOfFieldNearLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM +
      (distanceToSubjectInMM - focalLengthInMillimeters));

  const farDistanceInInches = 360;
  const nearFocalPointInInches = clamp(
    depthOfFieldNearLimitInMM / 25.4,
    0,
    farDistanceInInches
  );
  let farFocalPointInInches = clamp(
    depthOfFieldFarLimitInMM / 25.4,
    0,
    farDistanceInInches
  );
  if (farFocalPointInInches < nearFocalPointInInches) {
    farFocalPointInInches = farDistanceInInches;
  }

  const sensorHeight = isCustomSensor
  ? customSensorHeight
  : CIRCLES_OF_CONFUSION[sensor].sensorHeight;
  const verticalFieldOfView =
    (2 * Math.atan(sensorHeight / 2 / focalLengthInMillimeters) * 180) /
    Math.PI;

  // ── Derived photography values
  const hyperFocalDistanceInInches = hyperFocalDistanceInMM / 25.4;
  const isInfinityFar =
    depthOfFieldFarLimitInMM / 25.4 > farDistanceInInches ||
    depthOfFieldFarLimitInMM <= 0;
  const totalDofInches = farFocalPointInInches - nearFocalPointInInches;
  const canSetHyperfocal = hyperFocalDistanceInInches <= farDistanceInInches;

  // 35mm equivalent focal length (only relevant when not on full frame)
  const equivalentFocalLength = Math.round(
    focalLengthInMillimeters * cropFactor
  );

  // Diffraction: airy disk (0.001342 × N mm) should not exceed CoC
  const diffractionLimitFStop =
    circleOfConfusionInMillimeters / 0.001342;
  const hasDiffractionRisk = aperture > diffractionLimitFStop;

  // DoF use-case character based on total depth
  const totalDofFeet = totalDofInches / 12;
  const dofCharacter =
    totalDofFeet < 0.5
      ? { label: "Macro / Product", color: "purple" }
      : totalDofFeet < 3
      ? { label: "Portrait Range", color: "blue" }
      : totalDofFeet < 10
      ? { label: "Group / Event", color: "teal" }
      : totalDofFeet < 30
      ? { label: "Street / Architecture", color: "green" }
      : { label: "Landscape", color: "gray" };

  // ── Theme-aware colors 
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const topBarBg = useColorModeValue("gray.50", "gray.900");

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const distanceMarks = useMemo(() => {
    if (system === "Imperial") {
      return new Array(Math.floor(farDistanceInInches / 24) + 1)
        .fill(0)
        .map((_v, i) => (i + 1) * 24)
        .map((val) => ({
          value: val,
          label: `${val / 12}'`,
        }));
    } else {
      const farDistanceInMeters = farDistanceInInches * 0.0254;
      const convertMetersToInches = (meters: number) => meters * 39.3701;
      return new Array(Math.floor(farDistanceInMeters) + 1)
        .fill(0)
        .map((_val, val) => ({
          value: convertMetersToInches(val + 1),
          label: `${val + 1}m`,
        }));
    }
  }, [system, farDistanceInInches]);

  return (
    <>
      <Flex
        bg={topBarBg}
        justify="flex-end"
        px={4}
        py={2}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Tooltip
          label={
            colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
            size="sm"
            variant="ghost"
            onClick={toggleColorMode}
          />
        </Tooltip>
      </Flex>

      <Box p={2} pt={4}>
        <PhotographyGraphic
          distanceToSubjectInInches={distanceToSubjectInInches}
          nearFocalPointInInches={nearFocalPointInInches}
          farFocalPointInInches={farFocalPointInInches}
          farDistanceInInches={farDistanceInInches}
          subject={subject as keyof typeof SUBJECTS}
          focalLength={focalLengthInMillimeters}
          aperture={aperture}
          system={system}
          verticalFieldOfView={verticalFieldOfView}
          onChangeDistance={(val) => setDistanceToSubjectInInches(val)}
        />
      </Box>

      {/* ── DoF Stats Panel ── */}
      <Box px={6} pt={2}>
        <SimpleGrid columns={4} spacing={3}>
          {[
            {
              label: "Near Focus",
              value: convertUnits(nearFocalPointInInches, 0),
            },
            {
              label: "Far Focus",
              value: isInfinityFar
                ? "∞"
                : convertUnits(farFocalPointInInches, 0),
            },
            {
              label: "Total DoF",
              value: isInfinityFar ? "∞" : convertUnits(totalDofInches, 0),
            },
            {
              label: "Hyperfocal",
              value: convertUnits(hyperFocalDistanceInInches, 0),
            },
          ].map(({ label, value }) => (
            <Box
              key={label}
              bg={cardBg}
              rounded="lg"
              p={3}
              textAlign="center"
              border="1px"
              borderColor={borderColor}
            >
              <Text
                fontSize="xs"
                color={mutedText}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {label}
              </Text>
              <Text fontSize="lg" fontWeight="bold" mt={1}>
                {value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* DoF character badge + Set Hyperfocal action */}
        <Flex justify="space-between" align="center" mt={3}>
          <Badge
            colorScheme={dofCharacter.color}
            px={3}
            py={1}
            rounded="full"
            fontSize="sm"
          >
            {dofCharacter.label}
          </Badge>
          <Tooltip
            label={
              canSetHyperfocal
                ? "Focus at hyperfocal distance — everything from half this distance to ∞ will be sharp"
                : `Hyperfocal (${convertUnits(hyperFocalDistanceInInches, 0)}) is beyond the scene range`
            }
          >
            <Button
              size="xs"
              variant="outline"
              colorScheme="teal"
              isDisabled={!canSetHyperfocal}
              onClick={() =>
                setDistanceToSubjectInInches(
                  Math.round(hyperFocalDistanceInInches)
                )
              }
            >
              Set Hyperfocal
            </Button>
          </Tooltip>
        </Flex>
      </Box>

      {/* ── Controls ── */}
      <Box px={6}>
        <Box pt={4}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbRuler} boxSize={4} color={mutedText} />
              <Text fontSize="sm">Units</Text>
            </Flex>
            <Box flexGrow={1}>
              <RadioGroup
                onChange={(v) => setSystem(v as "Imperial" | "Metric")}
                value={system}
              >
                <Stack direction="row">
                  {SYSTEMS.map((s) => (
                    <Radio value={s} key={s} colorScheme="blue">
                      {s}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </Flex>
        </Box>

        {/* Subject Distance */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbRuler} boxSize={4} color={mutedText} />
              <Text fontSize="sm" textAlign="right">
                Distance ({system === "Imperial" ? "ft" : "m"})
              </Text>
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="distance to subject"
                colorScheme="blue"
                value={distanceToSubjectInInches}
                onChange={(val: number) => setDistanceToSubjectInInches(val)}
                min={10}
                max={400}
                step={1}
              >
                {distanceMarks.map(({ label, value }) => (
                  <SliderMark key={value} value={value} {...labelStyles}>
                    {label}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Flex>
        </Box>

        {/* Focal Length */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbZoomIn} boxSize={4} color={mutedText} />
              <Text fontSize="sm" textAlign="right">
                Focal Length (mm)
              </Text>
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="focal length"
                colorScheme="blue"
                value={focalLengthInMillimeters}
                onChange={(val: number) => setFocalLengthInMillimeters(val)}
                min={3}
                max={400}
                step={1}
              >
                {[14, 28, 35, 50, 70, 85, 100, 135, 155, 200].map((val) => (
                  <SliderMark key={val} value={val} {...labelStyles}>
                    {val}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Flex>
          <Flex gap={2} mt={2}>
            <Box w="20%"></Box>
            <Box flexGrow={1}>
              <Flex justify="space-between" align="center">
                <img src={Fisheye} alt="Fisheye lens" style={{ height: 50 }} />
                {sensor !== "35mm (full frame)" && (
                  <Text fontSize="xs" color={mutedText}>
                    ≈ {equivalentFocalLength}mm full-frame equivalent
                  </Text>
                )}
                <img
                  src={Telephoto}
                  alt="100-400 lens"
                  style={{ height: 50 }}
                />
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Aperture */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbAperture} boxSize={4} color={mutedText} />
              <Text fontSize="sm">Aperture</Text>
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="aperture"
                colorScheme="blue"
                value={aperture}
                onChange={(val: number) => setAperture(val)}
                min={0.8}
                max={22}
                step={0.1}
              >
                {[0.8, 1.4, 1.8, 2.8, 4, 5.6, 8, 11, 16, 22].map((val) => (
                  <SliderMark key={val} value={val} {...labelStyles}>
                    {val}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Flex>
          {hasDiffractionRisk && (
            <Flex mt={2} justify="flex-start" pl="calc(20% + 8px)">
              <Badge
                colorScheme="orange"
                variant="subtle"
                px={2}
                py={0.5}
                fontSize="xs"
                rounded="md"
              >
                ⚠ Diffraction may reduce sharpness above f/
                {diffractionLimitFStop.toFixed(1)} on this sensor
              </Badge>
            </Flex>
          )}
        </Box>

        {/* Sensor + Subject */}
        <Box pt={6}>
          {isCustomSensor && (
  <Box mt={2}>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>Width (mm)</Text>
      <input
        type="number"
        value={customSensorWidth}
        onChange={(e) => setCustomSensorWidth(Number(e.target.value))}
        style={{ width: 70, padding: "2px 6px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </Flex>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>Height (mm)</Text>
      <input
        type="number"
        value={customSensorHeight}
        onChange={(e) => setCustomSensorHeight(Number(e.target.value))}
        style={{ width: 70, padding: "2px 6px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </Flex>
  </Box>
)}<Flex gap={2}>
            <Flex gap={2} width="50%">
              <Flex w="20%" mt={2} justify="flex-end" align="center" gap={1.5}>
                <Icon as={FiCamera} boxSize={4} color={mutedText} />
                <Text fontSize="sm" textAlign="right">
                  Sensor
                </Text>
              </Flex>
              <Box flexGrow={1}>
                <Select
                  value={sensor}
                  placeholder="Sensor"
                  onChange={(evt) => {
                    if (!evt?.target?.value) {
                      return;
                    }
                    setSensor(evt?.target?.value);
                  }}
                >
                  {Object.entries(CIRCLES_OF_CONFUSION).map(([key]) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </Select>
              </Box>
            </Flex>

            <Flex gap={2} width="50%">
              <Flex w="20%" mt={2} justify="flex-end" align="center" gap={1.5}>
                <Icon as={TbUser} boxSize={4} color={mutedText} />
                <Text fontSize="sm" textAlign="right">
                  Subject
                </Text>
              </Flex>
              <Box flexGrow={1}>
                <Select
                  value={subject}
                  placeholder="Subject"
                  onChange={(evt) => {
                    if (
                      SUBJECTS[evt?.target?.value as keyof typeof SUBJECTS]
                    ) {
                      setSubject(evt?.target?.value);
                    }
                  }}
                >
                  {Object.entries(SUBJECTS).map(([key]) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Divider mt={6} borderColor={borderColor} />

        {/* Quick Presets */}
        <Box pt={4} pb={2}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={mutedText}
            textAlign="center"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
          >
            Quick Presets
          </Text>
          <Wrap justify="center" spacing={2}>
            {COMMON_SETUPS.map((setup) => (
              <WrapItem key={setup.name}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => {
                    setFocalLengthInMillimeters(setup.focalLength);
                    setAperture(setup.aperture);
                    setSensor(setup.sensor);
                    setDistanceToSubjectInInches(setup.idealDistance);
                  }}
                >
                  {setup.name}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* GitHub Footer */}
        <Box pt={2} pb={6} textAlign="center">
          <Button
            as="a"
            href="https://github.com/jherr/depth-of-field"
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FiGithub} />}
            color={mutedText}
            _hover={{ color: colorMode === "dark" ? "gray.200" : "gray.800" }}
          >
            Contribute on GitHub
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default App;
