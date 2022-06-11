import styled from 'styled-components';
import { Container } from 'styles/theme';

const AboutMe: React.FC = () => {
  return <AboutMeContainer>{`Hello, my name is hyunjin.`}</AboutMeContainer>;
};

const AboutMeContainer = styled(Container)`
  background-color: red;
  /* position: sticky; */
  position: relative;
  height: 100vh;
`;

export default AboutMe;
