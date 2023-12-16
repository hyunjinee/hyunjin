import styled from 'styled-components';
import { flexCenter } from 'styles/utils';
import TextSlider from './TextSlider';
import ProgressBar from './ProgressBar';

const Slider2: React.FC = () => {
  return (
    <SliderContainer>
      <TextSlider />
      <ProgressBar />
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  ${flexCenter};

  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

export default Slider2;
