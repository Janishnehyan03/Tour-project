import React from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendar,
  faFlag,
  faPerson,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Link from "next/link";

function Destinations({ tours }) {
  return (
    <div className={`${styles.destination} `}>
      <h1 className={styles.title}>our popular destinations</h1>
      <div className={styles.card_container}>
        {tours.length > 0 &&
          tours.map((tour, index) => (
            <div className={styles.card}>
              <div className={styles.card__header}>
                <div className={styles.card__picture}>
                  <div className={styles.card__picture_overlay}>
                    <Image
                      src={"/img/travel1.jpg"}
                      className={styles.card__picture_img}
                      layout="fill"
                    />
                  </div>
                </div>
                <div className={styles.heading_tertirary}>
                  <span>{tour.name}</span>
                </div>
              </div>
              <div className={styles.card__details}>
                <h4 className={styles.card__sub_heading}>
                  {tour.difficulty} - {tour.duration} Days
                </h4>
                <p className={styles.card__text}>{tour.summary}</p>
                <div className={styles.card_data}>
                  <FontAwesomeIcon
                    className={styles.card_icon}
                    color="#55c57a"
                    icon={faLocationDot}
                  />
                  <span>{tour.startLocation.description}</span>
                </div>
                <div className={styles.card_data}>
                  <FontAwesomeIcon
                    className={styles.card_icon}
                    color="#55c57a"
                    icon={faCalendar}
                  />
                  <span> {moment(tour.startDates[0]).format("MMM yyyy")}</span>
                </div>
                <div className={styles.card_data}>
                  <FontAwesomeIcon
                    className={styles.card_icon}
                    color="#55c57a"
                    icon={faPerson}
                  />
                  <span> {tour.maxGroupSize} members</span>
                </div>
                <div className={styles.card_data}>
                  <FontAwesomeIcon
                    className={styles.card_icon}
                    color="#55c57a"
                    icon={faFlag}
                  />
                  <span> {tour.locations.length} stops</span>
                </div>
              </div>
              <div className={styles.card_footer}>
                <p>
                  <span className={styles.card__footer_value}>
                    ₹{tour.price}
                  </span>
                  <span className={styles.card__footer_text}>/ person</span>
                </p>
                <p>
                  <span className={styles.card__footer_value}>
                    {tour.ratingsAverage} rating
                  </span>
                  <span className={styles.card__footer_text}>
                    ({tour.ratingsQuantity})
                  </span>
                </p>
                <Link href={"tours/" + tour.slug}>
                  <button className={styles.btn}>Details</button>
                </Link>{" "}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Destinations;
