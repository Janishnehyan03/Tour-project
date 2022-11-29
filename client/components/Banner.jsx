import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

function Banner() {
  return (
    <>
      <div className={styles.banner}>
        <nav>
          <h1 className={styles.logo}>EXPLORE</h1>
          <ul>
            <li>
              <Link className={styles.link} href={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link className={styles.link} href={"/"}>
                About
              </Link>
            </li>
            <li>
              <Link className={styles.link} href={"/"}>
                services
              </Link>
            </li>
            <li>
              <Link className={styles.link} href={"/"}>
                packages
              </Link>
            </li>
            <li>
              <Link className={styles.link} href={"/"}>
                contact
              </Link>
            </li>
          </ul>
          <button>Register</button>
        </nav>
        <div className={styles.main}>
          <h1>
            explore the beauty <br />
            of world
          </h1>
          <p>
            all the books in the world. The best stories are found <br />
            between the pages of a passport
          </p>
          <button className={styles.learn}>Learn More</button>
        </div>
      </div>
    </>
  );
}

export default Banner;
