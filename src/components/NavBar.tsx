import getUserDetails from "@/helpers/getUserDetails";
import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  const userDetails = await getUserDetails();
  const userId = userDetails?._id?.toString();

  return (
    <header>
      <nav className="flex justify-between items-center bg-black text-white p-5">
        <Link href="/" className="logo flex items-center gap-2 font-bold">
          <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
          <p>Arts</p>
        </Link>

        <ul className="flex gap-4">
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
