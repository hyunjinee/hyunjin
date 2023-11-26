import Image from 'next/image';
import styled, { useTheme } from 'styled-components';

import { fadeIn } from 'styles/keyframes';
import { media } from 'styles/media';
import { flexCenter } from 'styles/utils';

const Slider: React.FC = () => {
  const theme = useTheme();
  const isDarkTheme = theme.color.black === '#000000';

  console.log(theme.color.black);

  return (
    <SliderContainer>
      <TextContainer>
        <div className="first">FRONTEND</div>
        <div className="second">ENGINEER</div>
        <div className="third">HYUNJIN LEE</div>
      </TextContainer>
      <ImageContainer>
        {isDarkTheme ? (
          <Image
            src="/assets/arrow3.svg"
            width={188}
            height={105}
            alt="scroll down"
          />
        ) : (
          <Image
            src="/assets/arrow.svg"
            width={188}
            height={105}
            alt="scroll down"
          />
        )}
      </ImageContainer>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  /* z-index: 100; */

  ${flexCenter}

  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

const TextContainer = styled.div`
  font-size: 12rem;
  line-height: 1.15;
  font-weight: 900;
  /* position: absolute;
  top: 0; */

  /* width: 100%;
  height: 100%; */ /* z-index: 10; */
  /* width: 100%; */
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

const ImageContainer = styled.div`
  position: absolute;
  bottom: 0;
  color: ${({ theme }) => theme.color.white};
  svg {
    fill: red;
    stroke: red;
  }
`;

export default Slider;
