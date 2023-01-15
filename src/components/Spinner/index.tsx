import { Oval } from "react-loader-spinner";
import SpinnerSettings from "../../utils/spinnerSettings";
import { SpinnerProps } from "./interfaces";
import { SpinnerContainer } from "./styles";

const Spinner = ({ isVisible }: SpinnerProps) => {
  const { color, secondaryColor, size, stroke } = SpinnerSettings;
  return (
    <SpinnerContainer>
      <Oval
        height={size}
        width={size}
        color={color}
        visible={isVisible}
        secondaryColor={secondaryColor}
        strokeWidth={stroke}
        strokeWidthSecondary={stroke}
      />
    </SpinnerContainer>
  );
};

export default Spinner;
