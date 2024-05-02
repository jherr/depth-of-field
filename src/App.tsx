import { useState } from "react";

import PhotographyGraphic from "./PhotographyGraphic";

const CIRCLES_OF_CONFUSION = {
  "35mm (full frame)": 0.029,
  "APS-C": 0.019,
  "Micro Four Thirds": 0.015,
  "Medium Format": 0.043,
  "Large Format": 0.1,
};

function App() {
  const [distanceToSubjectInInches, setDistanceToSubjectInInches] =
    useState(72);
  const [focalLengthInMillimeters, setFocalLengthInMillimeters] = useState(50);
  const [aperture, setAperture] = useState(1.8);
  const [circleOfConfusionInMillimeters, setCircleOfConfusionInMillimeters] =
    useState(0.029);

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

  const nearFocalPointInInches = depthOfFieldNearLimitInMM / 25.4;
  const farFocalPointInInches = depthOfFieldFarLimitInMM / 25.4;

  return (
    <>
      <PhotographyGraphic
        distanceToSubjectInInches={distanceToSubjectInInches}
        nearFocalPointInInches={nearFocalPointInInches}
        farFocalPointInInches={farFocalPointInInches}
      />
      <div>{depthOfFieldNearLimitInMM}</div>
      <div>{depthOfFieldFarLimitInMM}</div>

      <div>{nearFocalPointInInches}</div>
      <div>{farFocalPointInInches}</div>
    </>
  );
}

export default App;
