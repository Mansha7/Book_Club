import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInWithGoogle } from "../Auth/SignInWithGoogle";
import { SignInWithDemo } from "../Auth/SignInWithDemo";
import { SignOut } from "../Auth/SignOut";

// @to-do click outside
export const DropdownMobile = ({ currentUserId, userName, profilePic }) => {
  const dropdownList = [
    {
      id: "1",
      name: "Home",
      link: "/",
    },
    {
      id: "2",
      name: "Films",
      link: "/films",
    },
    {
      id: "3",
      name: "Members",
      link: "/members",
    },
    {
      id: "4",
      name: "Reviews",
      link: "/reviews",
    },
  ];

  return (
    <div
      className="mobile-dropdown-nav active sans-serif static absolute left-0 top-[2.3rem] z-50 w-full
        flex-col rounded-sm bg-h-blue p-2"
    >
      {currentUserId && (
        <div className="mx-4 flex items-center gap-1 py-1">
          <Link href={"/profile/" + currentUserId}>
            <Image
              src={profilePic}
              alt={userName}
              width={24}
              height={24}
              className="rounded-xl"
            />
          </Link>
          <Link
            href={"/profile/" + currentUserId}
            className=" font-semibold uppercase text-p-white hover:cursor-pointer hover:text-p-white"
          >
            {userName}
          </Link>
        </div>
      )}

      <ul className="sans-serif mx-3 rounded-sm bg-h-blue py-3 font-bold uppercase tracking-widest text-sh-grey">
        <li className="divider-mobile"></li>

        <li className="grid grid-cols-2 py-2">
          {dropdownList.map((L) => (
            <Link
              key={L.id}
              className="mx-3 py-1 hover:text-p-white"
              href={L.link}
            >
              {L.name}
            </Link>
          ))}
        </li>
        <li className="divider-mobile"></li>
        {currentUserId ? (
          <li className="mx-3 grid grid-cols-2 py-3">
            <Link href="/settings" className="block pt-2">
              Settings
            </Link>
            <SignOut />
          </li>
        ) : (
          <li className="grid grid-cols-2 pt-3">
            <SignInWithGoogle />
            <SignInWithDemo />
          </li>
        )}
      </ul>
    </div>
  );
};
