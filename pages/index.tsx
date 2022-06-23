import type { NextPage } from 'next';
import styled from 'styled-components';

import Card from 'components/common/card';
import Header from 'components/common/header';

const color = ['#F2003C', '#DD63A7', '#6748B6', '#94C2F3', '#73BE68'];

const contents = [
  {
    contentName: 'Algorithm',
    category: 'Study',
    place: 'hyunjin',
    date: 'Dec 18, 2020',
    contentUrl: 'https://github.com/hyunjinee/Algorithm',
    color: '#73BE68',
  },
  {
    contentName: '방슐랭 가이드',
    date: 'Oct 1, 2021',
    category: 'Project',
    place: 'Hello Center',
    contentUrl: 'temp',
    color: '#DD63A7',
  },
  {
    contentName: '투두투두',
    date: 'Mar 11, 2022',
    category: 'Project',
    place: 'hyunjin',
    contentUrl: 'https://github.com/hyunjinee/todo',
    color: '#DD63A7',
  },
  {
    contentName: 'Software Maestro',
    date: 'Apr 10, 2022',
    category: 'Course',
    place: 'swmaestro center',
    contentUrl: 'https://www.swmaestro.org/sw/main/main.do#secondPage',
    color: '#6748B6',
  },
  {
    contentName: 'Redux에 대한 생각',
    date: 'Apr 28, 2022',
    category: 'Blog',
    place: 'hyunjin',
    contentUrl: 'https://hyunjinee.tistory.com/63?category=970038',
    color: '#73BE68',
  },
  {
    contentName: '웹은 어떻게 발전했는가',
    date: 'May 10, 2022',
    category: 'Conference Talk',
    place: 'swmaestro center',
    contentUrl: 'https://github.com/hyunjinee/storyofweb',
    color: '#94C2F3',
  },
  {
    contentName: 'qwzd',
    date: 'May 12, 2022',
    category: 'Project',
    place: 'qwzd team',
    contentUrl: 'https://qwzd.kr/',
    color: '#DD63A7',
  },
  {
    contentName: 'react-docs',
    date: 'May 13, 2022',
    category: 'Blog',
    place: 'hyunjin',
    contentUrl: 'https://github.com/hyunjinee/react-docs',
    color: '#73BE68',
  },
  {
    contentName: 'Rendering Patterns',
    date: 'July 7, 2022',
    category: 'Conference Talk',
    place: 'swmaestro center',
    contentUrl: 'temp',
    color: '#94C2F3',
  },
];

const Home: NextPage = () => {
  return (
    <Container>
      <section>
        <Header />
      </section>
      <AboutMeSection>
        <h2>About Me</h2>
        <p>
          {"Hello! I'm hyunjin. 24y/o developer."} <br />
          {
            "I'm interested in TypeScript, React, GraphQL, Web Performance, and Cloud technologies."
          }
          <br />
          {"I'm also interested in talking in Conferences and Open Sources."}
          <br />
          {
            'I would like to give myself some challenges and overcome them.'
          }{' '}
          <br />
          <br />
          <strong>{'"Endless failure, Endless Improvement"'}</strong>
          {/* I like to make computer science concepts easier for anyone who's interested in tech, by writing approachable articles on technical content through visualizations!" */}
        </p>
      </AboutMeSection>

      <ContentSection>
        <h2>Contents</h2>
        <CardContainer>
          {contents.map((content, index) => {
            return <Card key={index} {...content} />;
          })}
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
    /* font-size: 1.8rem; */
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
    font-size: 1.8rem;
    font-weight: 500;
    color: #b7b4c7;

    strong {
      font-weight: 900;
    }
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
