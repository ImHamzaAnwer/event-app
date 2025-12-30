// import getUserDetails from "@/helpers/getUserDetails";
import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  // const userDetails = await getUserDetails();
  // const userId = userDetails?._id?.toString();

  return (
    <header className="flex justify-between items-center bg-black text-white px-5 h-[70px]">
      <Link href="/" className="logo flex items-center gap-2 font-bold">
        <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
        <p>Arts</p>
      </Link>

      <nav>
        <ul className="flex gap-x-6 uppercase text-sm font-semibold">
          <Link href="/about">Who we are</Link>
          <Link href="/learn">Learn</Link>
          {/* <Link href={`/profile/${userId}`}>Profile</Link> */}
          <Link href="/events">Events</Link>
          <Link href="/facilities">Facilities</Link>
        </ul>
      </nav>

      <button type="button" className="btn btn-primary">Get Tickets</button>
    </header>
  );
};

export default NavBar;
