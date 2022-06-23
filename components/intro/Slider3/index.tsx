import styled, { useTheme } from 'styled-components';
import { fadeIn } from 'styles/keyframes';
import { media } from 'styles/media';
import { flexCenter } from 'styles/utils';

const Slider: React.FC = () => {
  const theme = useTheme();
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
  font-size: 12rem;
  line-height: 1.15;
  font-weight: 900;

  ${media.large} {
    font-size: 10rem;
  }

  ${media.xSmall} {
    font-size: 5rem;
  }

  .first {
    padding-bottom: 5rem;
    animation: ${fadeIn} 1s;
    text-align: center;

    ${media.small} {
      padding-bottom: 2rem;
    }
  }

  .second {
    padding-bottom: 5rem;
    text-align: center;

    animation: ${fadeIn} 2s;
  }

  .third {
    padding-bottom: 5rem;
    text-align: center;

    animation: ${fadeIn} 3s;
  }
`;

export default Slider;
