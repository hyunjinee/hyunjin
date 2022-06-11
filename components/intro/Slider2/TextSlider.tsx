import styled, { keyframes } from 'styled-components';

const TextSlider: React.FC = () => {
  return (
    <TextSliderContainer>
      <div className="slider">
        <div className="slide">FRONTEND</div>
        <div className="slide">ENGINEER</div>
        <div className="slide">HYUNJIN LEE</div>
      </div>
    </TextSliderContainer>
  );
};

const slide = keyframes`
    0% {
        margin-left: 0;
    }

    20% {
        margin-left: 0;
    }


    35% {
        margin-left: -100%;
    }

    60% {
        margin-left: -100%;
    }


    75% {
        margin-left: -200%;
    }

    90% {
        margin-left: -200%;
    }

    100% {
        margin-left: 0;
    }
`;
const TextSliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  /* -webkit-user-select: none;
  -webkit-text-size-adjust: none;
  ::-webkit-scrollbar {
    display: none;
  } */
  .slider {
    display: flex;
    width: 300%;
    animation: ${slide} 3s infinite;
    .slide {
      color: ${({ theme }) => theme.color.white};
      font-size: 9.6rem;
      line-height: 11.7rem;
      letter-spacing: 0.12em;
      width: 100%;
      text-align: center;
      font-weight: 900;
      box-sizing: border-box;
      &:nth-child(1) {
        position: relative;
        ::after {
          width: 100%;
          content: 'FRONTEND';
          position: absolute;
          left: -0.4rem;
          top: -0.4rem;
          opacity: 0.7;
          color: transparent;
          -webkit-text-stroke: 0.1rem ${({ theme }) => theme.color.red};
        }
        ::before {
          width: 100%;
          content: 'FRONTEND';
          position: absolute;
          left: 0.4rem;
          top: 0.4rem;
          -webkit-text-stroke: 0.1rem ${({ theme }) => theme.color.blue};
          opacity: 0.7;
          color: transparent;
        }
      }
      &:nth-child(2) {
        color: transparent;
        -webkit-text-stroke: 0.1rem ${({ theme }) => theme.color.white};
      }
    }
  }
`;

export default TextSlider;
