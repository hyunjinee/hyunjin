import styled from 'styled-components';
import { media } from 'styles/media';

export const Name = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  letter-spacing: 0.02rem;

  ${media.large} {
    font-size: 5rem;
    margin-bottom: 1.5rem;
  }

  ${media.small} {
    font-size: 4.2rem;
  }
`;

export const Job = styled.p`
  width: 100%;
  font-weight: bolder;
  letter-spacing: -0.036rem;
  margin-bottom: 3.2rem;
  font-size: 1.8rem;
  line-height: 3.42rem;
  word-spacing: 0px;
  color: #b7b4c7;
  text-decoration: none;
  font-family: Inter, -apple-system, 'system-ui';

  ${media.large} {
    line-height: 1.9rem;
  }

  ${media.small} {
  }
`;

export const SocialMedia = styled.div`
  display: flex;

  & > a {
    margin: 0.5rem;
  }
`;
