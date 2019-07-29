import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Axios from 'axios';


const MatchOption = (props) => {
    const {messages, messageClicked, match, interests, onDump, onFriendzone, user } = props;
    let [matchInt, matchIntChange] = useState([match.int1, match.int2, match.int3]);
    let [dateSuggestion, suggestionChange] = useState([]);
    let [dateinfo, dateChange] = useState([{ name: 'a date?' }])
    let [restaurantType, setType] = useState(null);
    let [count, setCount] = useState(1);

    useEffect(() => {
        // Your code here
        function suggester() {
            matchInt.forEach((interest) => {
                if (interests.indexOf(interest) !== 1) {
                    suggestionChange(dateSuggestion = interest);
                }
            })
        }
        suggester();
    }, []);

        async function setRestaurant() {
            try {
                setType(restaurantType = dateSuggestion)
                const options = {
                    method: 'get',
                    url: '/restDecider',
                    params: {
                        restaurantFilter: restaurantType,
                    }
                }
                let result = await Axios(options)
                dateChange(dateinfo = result.data)
            } catch (err) {
                console.log(err);
            }
        }


    function newChoice() {
        if (dateinfo.length === 1) {
            dateChange(dateinfo = [{ name: `¯\\_(ツ)_/¯. Do you even like ${dateSuggestion}` }])
        } else {
            dateChange(dateinfo.slice(1));
        }
    }

    function invite() {
        count++ % 2 === 0 ? sendInvite() : setRestaurant()
        setCount(count++)
    }

    function sendInvite() {
        const options = {
            method: 'post',
            url: '/sendMessage',
            params: {
                sentFrom: user.name,
                userId: match.id,
                message: 1,
            }
        }
        Axios(options)
            .then((response) => {
                console.log('no error', response)
                confirm(`Lunch date set with ${match.name}. Go get em tiger!`)
            })
            .catch((error) => {
                console.log('error'.errror)
            })
    }
    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg className="match-pic" src={match.pic} />
            <h4>{match.name}</h4>
            <Card.Text>Age: {match.age}</Card.Text>
            <Card.Text>Bio: {match.bio}</Card.Text>
            <div className="row col-12 action-button-div mx-auto">
                <button className="btn col-6 action-button" id={match.id} onClick={onFriendzone}>Friendzone</button>
                <button className="btn col-6 action-button" id={match.id} onClick={onDump} >Dump</button>
            </div>
            <Card.Text>You both enjoy {dateSuggestion} restaurants</Card.Text>
            <Card.Text>Invite to {`${dateinfo[0].name}?`}</Card.Text>
            <div className="row col-12 action-button-div mx-auto">
                <button className="btn col-10 action-button mx-auto" type="button" onClick={invite}>Yes! Let's do lunch!</button>
                <button className="btn col-10 action-button mx-auto" type="button" onClick={newChoice}>YUCK! New Choice Please</button>
            </div>
        </Card>
    )
   
}

export default MatchOption;