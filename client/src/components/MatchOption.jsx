import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Axios from 'axios';


const MatchOption = (props) => {
    const { match, interests, user } = props;
    let [matchInt, matchIntChange] = useState([match.int1, match.int2, match.int3]);
    let [dateSuggestion, suggestionChange] = useState([]);
    let [dateinfo, dateChange] = useState([{ name: 'yes' }])
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
                alert(`Lunch date set with ${match.name}. Go get em tiger!`)
            })
            .catch((error) => {
                console.log('error'.errror)
            })
    }

    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg src={match.pic} />
            <Card.Title>{match.name}</Card.Title>
            <Card.Text>Age: {match.age}</Card.Text>
            <Card.Text>Bio: {match.bio}</Card.Text>
            <div className="row col-12 action-button-div">
                <button className="btn col-6 action-button">Friendzone</button>
                <button className="btn col-6 action-button">Dump</button>
            </div>
            <Card.Text>You both enjoy {dateSuggestion} restaurants</Card.Text>
            <Card.Text>Ask to go to {`${dateinfo[0].name}?`}</Card.Text>
            <button type="button" onClick={invite}>Yes! Let's do lunch!</button>
            <button type="button" onClick={newChoice}>YUCK! New Choice Please</button>
        </Card>
    )
}

export default MatchOption;