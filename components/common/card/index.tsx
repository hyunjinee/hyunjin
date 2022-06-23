import Image from 'next/image';
import Link from 'next/link';
import {
  Category,
  Container,
  ContentContainer,
  ContentName,
  Footer,
} from './styles';

interface CardProps {
  category?: string;
  contentName?: string;
  contentUrl?: string;
  place?: string;
  date?: string;
  color: string;
}

const Card: React.FC<CardProps> = ({
  contentName,
  date,
  category,
  place,
  contentUrl,
  color,
}) => {
  return (
    <Container>
      <Category color={color}>{category}</Category>
      <ContentContainer>
        <ContentName>{contentName}</ContentName>
      </ContentContainer>
      <Link href="/">
        <a rel="noreferrer" className="link">
          <Image src="/assets/link.svg" width={20} height={20} alt="link" />
        </a>
      </Link>
      <Footer>
        <h4>{place}</h4>
        <h6>{date}</h6>
      </Footer>
    </Container>
  );
};

export default Card;
