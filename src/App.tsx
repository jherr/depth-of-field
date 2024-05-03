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
} from "@chakra-ui/react";

import PhotographyGraphic from "./PhotographyGraphic";
import {
  SmallDog,
  MediumDog,
  LargeDog,
  Human,
  HumanAtDesk,
} from "./PhotographyGraphic";

import Telephoto from "./assets/100-400.png";
import Fisheye from "./assets/fishey.png";

const CIRCLES_OF_CONFUSION: Record<
  string,
  {
    coc: number;
    sensorHeight: number;
  }
> = {
  Webcam: {
    coc: 0.002,
    sensorHeight: 3.6,
  },
  Smartphone: {
    coc: 0.002,
    sensorHeight: 7.3,
  },
  "35mm (full frame)": {
    coc: 0.029,
    sensorHeight: 24,
  },
  "APS-C": {
    coc: 0.019,
    sensorHeight: 15.6,
  },
  "Micro Four Thirds": {
    coc: 0.015,
    sensorHeight: 13,
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
];

const SUBJECTS: Record<string, () => ReturnType<typeof SmallDog>> = {
  "Small Dog": SmallDog,
  "Medium Dog": MediumDog,
  "Large Dog": LargeDog,
  Human: Human,
  "Human At Desk": HumanAtDesk,
};

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

  const distanceToSubjectInMM = distanceToSubjectInInches * 25.4;

  const circleOfConfusionInMillimeters = CIRCLES_OF_CONFUSION[sensor].coc;

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

  const sensorHeight = CIRCLES_OF_CONFUSION[sensor].sensorHeight;
  const verticalFieldOfView =
    (2 * Math.atan(sensorHeight / 2 / focalLengthInMillimeters) * 180) /
    Math.PI;

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
      function convertMetersToInches(meters: number) {
        return meters * 39.3701;
      }
      return new Array(Math.floor(farDistanceInMeters) + 1)
        .fill(0)
        .map((_val, val) => ({
          value: convertMetersToInches(val + 1),
          label: `${val + 1}m`,
        }));
      return [];
    }
  }, [system, farDistanceInInches]);

  return (
    <>
      <Box p={2} pt={6}>
        <PhotographyGraphic
          distanceToSubjectInInches={distanceToSubjectInInches}
          nearFocalPointInInches={nearFocalPointInInches}
          farFocalPointInInches={farFocalPointInInches}
          farDistanceInInches={farDistanceInInches}
          SubjectGraphic={SUBJECTS[subject]}
          focalLength={focalLengthInMillimeters}
          aperture={aperture}
          system={system}
          verticalFieldOfView={verticalFieldOfView}
          onChangeDistance={(val) => setDistanceToSubjectInInches(val)}
        />
      </Box>

      <Box px={6}>
        <Box pt={6}>
          <Flex gap={2}>
            <Box w="20%">
              <Text align="right">Units</Text>
            </Box>

            <Box flexGrow={1}>
              <RadioGroup
                onChange={(v) => setSystem(v as "Imperial" | "Metric")}
                value={system}
              >
                <Stack direction="row">
                  {SYSTEMS.map((system) => (
                    <Radio value={system} key={system}>
                      {system}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </Flex>
        </Box>

        <Box pt={6}>
          <Flex gap={2}>
            <Box w="20%">
              <Text align="right">
                Subject Distance ({system === "Imperial" ? "ft" : "m"})
              </Text>
            </Box>
            <Box flexGrow={1}>
              <Slider
                aria-label="distance to subject"
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

        <Box pt={6}>
          <Flex gap={2}>
            <Box w="20%">
              <Text align="right">Focal Length (mm)</Text>
            </Box>
            <Box flexGrow={1}>
              <Slider
                aria-label="focal length"
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
              <Flex justify="space-between">
                <img src={Fisheye} alt="Fishey lens" style={{ height: 50 }} />
                <img
                  src={Telephoto}
                  alt="100-400 lens"
                  style={{ height: 50 }}
                />
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Box pt={6}>
          <Flex gap={2}>
            <Box w="20%">
              <Text align="right">Aperture</Text>
            </Box>
            <Box flexGrow={1}>
              <Slider
                aria-label="aperture"
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
        </Box>

        <Box pt={6}>
          <Flex gap={2}>
            <Flex gap={2} width="50%">
              <Box w="20%" mt={2}>
                <Text align="right">Sensor Size</Text>
              </Box>
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
                </Select>
              </Box>
            </Flex>

            <Flex gap={2} width="50%">
              <Box w="20%" mt={2}>
                <Text align="right">Subject</Text>
              </Box>
              <Box flexGrow={1}>
                <Select
                  value={subject}
                  placeholder="Subject"
                  onChange={(evt) => setSubject(evt?.target?.value)}
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

        <Box p={4} pt={6}>
          <Flex gap={5} justify="center">
            {COMMON_SETUPS.map((setup) => (
              <Button
                key={setup.name}
                onClick={() => {
                  setFocalLengthInMillimeters(setup.focalLength);
                  setAperture(setup.aperture);
                  setSensor(setup.sensor);
                  setDistanceToSubjectInInches(setup.idealDistance);
                }}
              >
                {setup.name}
              </Button>
            ))}
          </Flex>
        </Box>

        <Box p={4} pt={6}>
          <Flex gap={5} justify="center">
            <a href="https://github.com/jherr/depth-of-field" target="_blank">
              Contribute to this open source project on GitHub.
            </a>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default App;
