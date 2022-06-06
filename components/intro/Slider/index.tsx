import styled from 'styled-components';
import { fadeIn } from 'styles/keyframes';
import { flexCenter } from 'styles/utils';

const Slider: React.FC = () => {
  return (
    <SliderContainer>
      <TextContainer>
        <div className="first">FRONTEND</div>
        <div className="second">ENGINEER</div>
        <div className="third">HYUNJIN LEE</div>
      </TextContainer>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  ${flexCenter}

  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

const TextContainer = styled.div`
  font-size: 3.75rem;
  line-height: 1.15;

  .first {
    font-size: 12rem;
    padding-bottom: 5rem;
    animation: ${fadeIn} 1s;
  }

  .second {
    font-size: 12rem;
    padding-bottom: 5rem;
    animation: ${fadeIn} 2s;
  }

  .third {
    font-size: 12rem;
    padding-bottom: 5rem;
    animation: ${fadeIn} 3s;
  }
`;

export default Slider;
