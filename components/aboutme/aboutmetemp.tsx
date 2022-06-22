import { useScroll } from 'hooks/useScroll';
import { useRef } from 'react';
import styled from 'styled-components';
import { Container } from 'styles/theme';
import { flexCenter } from 'styles/utils';

const opacityForBlock = (sectionProgress: number, blockNo: number) => {
  const progress = sectionProgress - blockNo;

  if (progress >= 0 && progress < 1) return 1;

  return 0.2;
};

const AboutMeTemp: React.FC = () => {
  const scrollY = useScroll();
  const refContainer = useRef<HTMLDivElement>(null);

  const numOfPages = 3;
  let progress = 0;

  const { current: elContainer } = refContainer;

  if (elContainer) {
    const { clientHeight, offsetTop } = elContainer;
    const screenH = window.innerHeight;
    const halfH = screenH / 2;
    const percentY =
      Math.min(
        clientHeight + halfH,
        Math.max(-screenH, scrollY - offsetTop) + halfH
      ) / clientHeight;

    progress = Math.min(numOfPages - 0.5, Math.max(0.5, percentY * numOfPages));
  }

  console.log(scrollY);
  return (
    <AboutMeContainer ref={refContainer}>
      <div className="first" style={{ opacity: opacityForBlock(progress, 0) }}>
        {`Hello, my name is HYUNJIN LEE.
  I'm a FrontEnd Engineer, Speaker, Traveler. 

  `}
      </div>
      <div className="second" style={{ opacity: opacityForBlock(progress, 1) }}>
        {`I'm interested at React, TypeScript.

  `}
      </div>
      <div className="third" style={{ opacity: opacityForBlock(progress, 2) }}>
        {`pracetice makes improvement.
  `}
      </div>
    </AboutMeContainer>
  );
};

const AboutMeContainer = styled(Container)`
  position: relative;
  ${flexCenter}
  height: 100vh;
  width: 100%;
  flex-direction: column;
  font-size: 4rem;
  white-space: pre-line;
  line-height: 1.2;

  background-color: ${({ theme }) => theme.color.black};

  .first {
    margin-top: 10rem;
    text-align: center;
  }
  .second {
    text-align: center;
  }
  .third {
    text-align: center;
  }
`;

export default AboutMeTemp;
