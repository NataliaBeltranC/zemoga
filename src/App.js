import * as React from "react";
import { useEffect } from 'react';
import { child, get, getDatabase, onValue, ref, set } from 'firebase/database';

import Nav from "./components/nav/nav";
import Card from "./components/card/card";
import Header from "./components/header/header";
import {calcDate} from "./commons/helpers/calc-date";
import BannerTop from "./components/banner/banner-top";
import { textLength } from './commons/helpers/text-length';
import BannerBottom from "./components/banner/banner-bottom";
import { TABLES_STORE } from './commons/constans/tables-store';
import { calcPercentage } from './commons/helpers/calc-percentage';
import Footer from './components/footer/footer';

const App = () => {

  const [candidatesData, setCandidatesData] = React.useState([]);
  const [selectInfo, setSelectInfo] = React.useState({list: true, grid: true});

  const database = getDatabase();
  const dbRef = ref(getDatabase());
  const postRef = ref(database, TABLES_STORE.POSTS);

  useEffect(() => {
    onValue(postRef, (snapshot) => {
      setCandidatesData(snapshot.val() || []);
    });
  }, [] )

  const updateLike = (type, index) => {
    const today = Date.now();
    const dateFormat = new Date(today).toISOString();
    get(child(dbRef, `${TABLES_STORE.POSTS}${index}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const post = snapshot.val();
        const counterPositive = type === 'positive' ? 1 : 0;
        const counterNegative = type === 'negative' ? 1 : 0;
        set(ref(getDatabase(), `${TABLES_STORE.POSTS}${index}`), {
          ...post,
          lastUpdated: dateFormat,
          votes: {
            positive: post.votes.positive + counterPositive,
            negative: post.votes.negative + counterNegative
          }
        });
      }
    })
  }

  const infoDate = (dateInfoItem, category) => {
    const {month, days, year} = calcDate(dateInfoItem)
    if (days === 0 && month === 0 && year === 0) {
      return `Today in ${category}`
    }
    if (month < 12) {
      return month === 1 ? `${month} month ago in ${category}` : `${month} months ago in ${category}`
    } else if (days < 31) {
       return days === 1 ? `${days} day ago in ${category}` : `${days} days ago in ${category}`
    } else {
      return year === 1 ? `${year} year ago in ${category}`: `${year} years ago in ${category}`
    }
  }

  const toggleListOrGrid = (event) => {
    if (event.target.value === 'grid') {
      setSelectInfo({list: false, grid: true})
    } else {
      setSelectInfo({list: true, grid: true})
    }
  }

  return (
      <div>
        <Nav/>
        <Header/>
        <div className="max-centered">
          <BannerTop/>
          <main role="main">
            <section className="card-votes">
              <div className="card-votes-head">
                <h2 className="card-votes__title">Previous Rulings</h2>
                <select onClick={toggleListOrGrid} onChange={toggleListOrGrid} name='SelectTypeView' className="card-votes__select">
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
              <ul className={selectInfo.list ? 'card-votes__grid card-votes__list': 'card-votes__grid'}>
                { candidatesData.map((
                    { picture,
                      lastUpdated,
                      name,
                      description,
                      category,
                      votes: { negative, positive }
                    }, index ) => {
                  return (
                      <li key={index} className="card-votes__li">
                        <Card
                            cardImageUrl={picture}
                            cardImageDescription={name}
                            description={textLength(description, 70)}
                            title={textLength(name, 21)}
                            iconHandUrl={ positive > negative ? "like.png" : 'dislike.png'}
                            iconHandDescription={positive > negative ? "Ganando" : 'Perdiendo'}
                            iconHandModifier={positive > negative ? "blue" : 'yellow'}
                            textDate= {infoDate(lastUpdated, category)}
                            index={index}
                            percentageDislike= {calcPercentage((negative + positive), negative)}
                            percentageLike= {calcPercentage((negative + positive), positive)}
                            vote={updateLike}
                        />
                      </li>
                  )
                })}
              </ul>
            </section>
          </main>
          <BannerBottom/>
          <hr role="separator"/>
          <Footer />
        </div>
      </div>
  );
}
export default App;
