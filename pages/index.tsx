import AboutMe from 'components/aboutme';
import Slider from 'components/intro/Slider';
import Slider2 from 'components/intro/Slider2';
import Projects from 'components/projects';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

const Home: NextPage = () => {
  return (
    <Container>
      <Slider />
      <AboutMe />
      <Slider />
      {/* <Slider2 /> */}

      <Projects />

      <div style={{ height: '100%' }}>hi</div>
    </Container>
  );
};

const Container = styled.div`
  /* width: 100%;
  height: 100%; */
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

export default Home;
