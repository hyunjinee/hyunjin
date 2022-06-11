import Slider from 'components/intro/Slider';
import Slider2 from 'components/intro/Slider2';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

const Home: NextPage = () => {
  return (
    <Container>
      <Slider />
      {/* <Slider2 /> */}
    </Container>
  );
};

const Container = styled.div`
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

export default Home;
