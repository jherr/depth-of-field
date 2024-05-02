import { useState } from "react";
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

const CIRCLES_OF_CONFUSION = {
  Webcam: 0.002,
  Smartphone: 0.002,
  "35mm (full frame)": 0.029,
  "APS-C": 0.019,
  "Micro Four Thirds": 0.015,
  "Medium Format": 0.043,
  "Large Format": 0.1,
};

const COMMON_SETUPS = [
  {
    name: "Webcam",
    focalLength: 3.6,
    aperture: 2.8,
    circleOfConfusion: 0.002,
    idealDistance: 36,
  },
  {
    name: "Smartphone",
    focalLength: 4.3,
    aperture: 1.8,
    circleOfConfusion: 0.002,
    idealDistance: 36,
  },
  {
    name: "APS-C 35mm",
    focalLength: 35,
    aperture: 1.8,
    circleOfConfusion: 0.019,
    idealDistance: 72,
  },
  {
    name: "FF - 28mm",
    focalLength: 28,
    aperture: 1.4,
    circleOfConfusion: 0.029,
    idealDistance: 48,
  },
  {
    name: "FF - 35mm",
    focalLength: 35,
    aperture: 1.4,
    circleOfConfusion: 0.029,
    idealDistance: 60,
  },
  {
    name: "FF - 50mm",
    focalLength: 50,
    aperture: 1.8,
    circleOfConfusion: 0.029,
    idealDistance: 72,
  },
  {
    name: "FF - 70mm",
    focalLength: 70,
    aperture: 2.8,
    circleOfConfusion: 0.029,
    idealDistance: 96,
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
  const [circleOfConfusionInMillimeters, setCircleOfConfusionInMillimeters] =
    useState(0.029);
  const [subject, setSubject] = useState("Human");
  const [system, setSystem] = useState<(typeof SYSTEMS)[number]>("Imperial");

  const distanceToSubjectInMM = distanceToSubjectInInches * 25.4;

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

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

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
        />
      </Box>

      <Box px={6}>
        <Box pt={6}>
          <Flex gap={2}>
            <Box w="20%">
              <Text align="right">Subject Distance (ft)</Text>
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
                {new Array(Math.floor(farDistanceInInches / 24) + 1)
                  .fill(0)
                  .map((_v, i) => (i + 1) * 24)
                  .map((val) => (
                    <SliderMark key={val} value={val} {...labelStyles}>
                      {val / 12}
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
                  value={circleOfConfusionInMillimeters}
                  placeholder="Sensor Size"
                  onChange={(evt) =>
                    setCircleOfConfusionInMillimeters(+evt?.target?.value)
                  }
                >
                  {Object.entries(CIRCLES_OF_CONFUSION).map(([key, val]) => (
                    <option key={key} value={val}>
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
                  setCircleOfConfusionInMillimeters(setup.circleOfConfusion);
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
            {SYSTEMS.map((system) => (
              <Button
                key={system}
                onClick={() => {
                  setSystem(system);
                }}
              >
                {system}
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
