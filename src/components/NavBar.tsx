import { getUserIdFromToken } from "@/helpers/getUserIdFromToken";
import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  const userId = await getUserIdFromToken();

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
          <p>DevEvents</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/dashboard">Manage Events</Link>
          <Link href={`/profile/${userId}`}>Profile</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
