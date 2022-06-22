import Image from 'next/image';
import Link from 'next/link';
import { Job, Name, SocialMedia } from './styles';

const Header: React.FC = () => {
  return (
    <>
      <Name>HYUNJIN LEE</Name>
      <Job>FrontEnd Engineer | Speaker | Traveler</Job>
      <SocialMedia>
        <Link href="https://github.com/hyunjinee">
          <a>
            <Image
              src="/assets/github.svg"
              width={15}
              height={15}
              alt="github"
            />
          </a>
        </Link>
        <Link href="/">
          <a>
            <Image
              src="/assets/instagram.svg"
              width={15}
              height={15}
              alt="github"
            />
          </a>
        </Link>
        <Link href="https://hyunjinee.tistory.com/">
          <a>
            <Image
              src="/assets/tistory2.png"
              width={15}
              height={15}
              alt="github"
            />
          </a>
        </Link>
      </SocialMedia>
    </>
  );
};

export default Header;
