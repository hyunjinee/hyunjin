import Slider from 'components/intro/Slider';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

const Home: NextPage = () => {
  return (
    <>
      <Slider />
    </>
  );
};

const Container = styled.div``;

export default Home;
