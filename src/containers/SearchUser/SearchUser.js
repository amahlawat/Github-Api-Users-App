import React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import Card from '../../components/Card/Card'
import * as User  from '../User/User'

const InputSearch = styled.input`
   width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`
const Container = styled.div`
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
`
const FlexContainer = styled.div `
    display: flex;
    flex-direction: row;
`

const Button = styled.button`
    color: default;
    width: 10%;
    height: 20px;
    margin: 20px;
`
function SearchUser(){ 
    const [data, setData] = React.useState();
    const [history, setHistory] = React.useState([]);
    const [tab, setTab] = React.useState('search');// tabs => search, history
    const [showError, setShowError] = React.useState(false);
    /*
    React.useEffect(() => {
        document.getElementById('searchInput').value = 'eravinashm';
        document.getElementById('searchInput').onkeypress;
    }, []);
    */
    // keypress handler
    async function keyPressHandler(event){
        if(event.key === 'Enter'){
            if(event.target.value === '')
                setShowError(true)
            else{
                setShowError(false);
                const response = await fetch('https://api.github.com/users/'+event.target.value)
                const json = await response.json()
                setData(json);   
                let tempHistory = history;
                tempHistory.push(json)
                setHistory(tempHistory) 
                document.getElementById('searchInput').value = ''
            }
        }
    }
    function historyHandler(){
        if(tab === 'search'){
            setTab('history');
           document.getElementById('searchInput').disabled = true;
        }
        else{
            document.getElementById('searchInput').disabled = false;
            setTab('search');
        }
    }
    return(
        <Container>
            <FlexContainer>
                <InputSearch type="text" placeholder="Write username then press enter" id="searchInput" onKeyPress={(event) => keyPressHandler(event)} />
                <Button onClick={() => historyHandler()}>History</Button>
            </FlexContainer>
            {
                tab === 'search' ? 
                <>
                { showError ? <p>input field cannot be empty</p>: null}
                {
                    data!== undefined  ? 
                    <>
                        <Card data={data} />
                        <Route path="/search-user/:username/repos" render={() => <User.Repos username={data.login} />} />
                        <Route path="/search-user/:username/followers" render={() => <User.Followers username={data.login}/>} />
                        <Route path="/search-user/:username/following" render={() => <User.Following username={data.login}/>} />                        
                    </>
                    : null
                }
                </>:
                <>
                 <ul>
                    {   history.length > 0  ? 
                        history.map((datum, index) => (<li key={index}>{datum.name}</li>)):
                        <h3>No history found</h3>
                    }
                </ul>
                </>
            }
        </Container>
    )
}

export default SearchUser;