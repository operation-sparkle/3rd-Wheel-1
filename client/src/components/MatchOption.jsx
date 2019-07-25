import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Axios from 'axios';


const MatchOption = (props) => {
    const { match, interests } = props;
    let [matchInt, matchIntChange] = useState([match.int1, match.int2, match.int3]);
    let [dateSuggestion, suggestionChange] = useState([]);
    let [dateinfo, dateChange] = useState([{ name: 'yes' }])
    let [restaurantType, setType] = useState(null);

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

    useEffect(() => {
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
        // Your code here
        setRestaurant();
    }, []);

    function newChoice() {
        if (dateinfo.length === 1) {
            dateChange(dateinfo = [{ name: `¯\\_(ツ)_/¯. Do you even like ${dateSuggestion}` }])
        } else {
            dateChange(dateinfo.slice(1));
        }
    }

    function sendLunch() {
        alert(`Lunch invite sent to ${match.name}`);
    }

    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg src={match.pic} />
            <Card.Title>{match.name}</Card.Title>
            <Card.Text>Age: {match.age}</Card.Text>
            <Card.Text>Bio: {match.bio}</Card.Text>
            <Card.Text>You both enjoy {dateSuggestion} restaurants</Card.Text>
            <Card.Text>Ask to go to {`${dateinfo[0].name}?`}</Card.Text>
            <button type="button" onClick={sendLunch}>Yes! Let's do lunch!</button>
            <button type="button" onClick={newChoice}>YUCK! New Choice Please</button>
        </Card>
    )
}

export default MatchOption;