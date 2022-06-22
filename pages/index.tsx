import type { NextPage } from 'next';
import styled from 'styled-components';

import Card from 'components/common/card';
import Header from 'components/common/header';

const Home: NextPage = () => {
  return (
    <Container>
      <section>
        <Header />
      </section>
      <AboutMeSection>
        <h2>About Me</h2>
        <p>
          {"Hello! I'm hyunjin. 24y/o developer."}{' '}
          {
            "specialized in TypeScript, GraphQL, Web Performance, and Cloud technologies. I like to make computer science concepts easier for anyone who's interested in tech, by writing approachable articles on technical content through visualizations!"
          }
        </p>
      </AboutMeSection>

      <ContentSection>
        <h2>Contents</h2>
        <CardContainer>
          <Card contentName="hi" />
          <Card contentName="hi" />
          <Card contentName="hi" />
        </CardContainer>
      </ContentSection>
    </Container>
  );
};

const Container = styled.div`
  /* width: 100%; */
  height: 100vh;
  max-width: 124.6rem;

  margin: auto;
  padding-right: 2.4rem;
  padding-left: 2.4rem;
  /* padding: 0 2.4rem; */
  color: ${({ theme }) => theme.color.white};
  /* background-color: ${({ theme }) => theme.color.black}; */
  /* background-color: #13111a; */

  section {
    position: relative;
    padding-top: 8rem;
  }

  h1 {
    color: #fff;
    margin-top: 0;
  }
`;

const AboutMeSection = styled.section`
  padding-top: 8rem;

  h2 {
    margin-top: 0;
    color: #fff;
    font-size: 3.2rem;
    /* line-height: 1.182em; */
    font-weight: 700;
    margin-bottom: 2.4rem;
    width: 100%;
    font-family: Thicccboi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
  }

  p {
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;

    margin-bottom: 3.2rem;
    line-height: 1.9;
    width: 100%;
    font-weight: 500;
  }
`;

const ContentSection = styled.section`
  h2 {
    margin-top: 0;
    font-size: 3.2rem;
    font-weight: 700;
    margin-bottom: 2.4rem;
    width: 100%;
  }
`;

const CardContainer = styled.div`
  position: relative;
  display: grid;
  grid-auto-columns: 1fr;
  grid-column-gap: 3.5rem;
  grid-row-gap: 3.5rem;
  grid-template-rows: auto;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  z-index: 1;
  width: 100%;
`;

export default Home;
