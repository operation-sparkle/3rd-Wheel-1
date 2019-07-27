import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Axios from 'axios';


const FriendOption = (props) => {
    const { friend, interests, user } = props;
    let [friendInt, friendIntChange] = useState([friend.int1, friend.int2, friend.int3]);
    let [dateSuggestion, suggestionChange] = useState([]);
    let [dateinfo, dateChange] = useState([{name: 'lunch'}])
    let [restaurantType, setType] = useState(null);
    let [count, setCount] = useState(1);

    useEffect(() => {
        // Your code here
        function suggester(){
            friendInt.forEach((interest) => {
                if(interests.indexOf(interest) !== 1){
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

    
    function newChoice(){
        if(dateinfo.length === 1){
            dateChange(dateinfo = [{ name: `¯\\_(ツ)_/¯. Do you even like ${dateSuggestion}`}])
        } else {
            dateChange(dateinfo.slice(1));
        }
    }

    function invite () {
        count++ % 2 === 0 ? sendInvite() : setRestaurant()
        setCount(count++)
    }

    function sendInvite () {
        const options = {
            method: 'post',
            url: '/sendMessage',
            params: {
                sentFrom: user.name,
                userId: friend.id,
                message: 1,
            }
        }
        Axios(options)
            .then((response) => {
                console.log('no error', response)
                confirm(`Lunch date set with ${friend.name}. Go get em tiger!`)
            })
            .catch((error) => {
                console.log('error'.errror)
            })
    }


    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg className="friend-pic"  src={friend.pic} />
            <h4>{friend.name}</h4>
            <Card.Text>Age: {friend.age}</Card.Text>
            <Card.Text>Bio: {friend.bio}</Card.Text>
            <Card.Text>You both enjoy {dateSuggestion} restaurants</Card.Text>
            <Card.Text>Ask to go to {`${dateinfo[0].name}?`}</Card.Text>
            <button className="btn invite-button" type="button" onClick={invite}>Yes! Let's do lunch!</button>
            <button className="btn invite-button" type="button" onClick={newChoice}>YUCK! New Choice Please</button>
        </Card>
    )
}

export default FriendOption;