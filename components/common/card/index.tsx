import Link from 'next/link';
import {
  Category,
  Container,
  ContentContainer,
  ContentName,
  Footer,
} from './styles';

interface CardProps {
  contentName: string;
  date: string;
}

const Card: React.FC<CardProps> = ({ contentName, date }) => {
  return (
    <Container>
      <Category>Category</Category>
      <ContentContainer>
        <ContentName>{contentName}</ContentName>
      </ContentContainer>
      {/* <Link href="/">
        <a rel="noreferrer"></a>
      </Link> */}
      <Footer>
        <h4>app.js ocnf</h4>
        <h6>june 4ed 2022</h6>
      </Footer>
    </Container>
  );
};

export default Card;
