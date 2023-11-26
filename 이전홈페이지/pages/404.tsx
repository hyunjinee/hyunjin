import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Custom404: NextPage = () => {
  const router = useRouter();

  return (
    <Custom404Wrapper>
      <ContentContainer>
        <TextContainer>
          <div className="main-text">Nothing here.</div>
        </TextContainer>
      </ContentContainer>
    </Custom404Wrapper>
  );
};

const Custom404Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ContentContainer = styled.div``;

const TextContainer = styled.div``;

const ImageContainer = styled.div``;

export default Custom404;
