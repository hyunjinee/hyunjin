import AboutMeTemp from 'components/aboutme/aboutmetemp';
import Slider from 'components/intro/Slider';
import Projects from 'components/projects';
import type { NextPage } from 'next';
import styled from 'styled-components';

const Test: NextPage = () => {
  return (
    <Container>
      <Slider />

      {/* <AboutMe */}
      <AboutMeTemp />
      <Slider />
      {/* <Slider2 /> */}

      <Projects />

      <div style={{ height: '100%' }}>hi</div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

export default Test;
