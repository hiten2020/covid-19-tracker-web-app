import React,{useState,useEffect} from 'react';
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core"
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData,prettyPrintStat } from './utils';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState(["USA","UK","INDIA"]); 
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80746,lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases");
  //useEffect  = Runs a peice of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    //the code inside here will run once 
    //when the component loads and not again

    //async => send a request , wait for it , do something with info
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country, //United States,United Kingdom
            value:country.countryInfo.iso2 //USA,UK
          }
        ))
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);

      })
    }

    getCountriesData();

  }, []);

  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;
    // console.log("COUNTY CODE",countryCode);

    // setCountry(countryCode);

    const url = countryCode==="worldWide" 
    ? 'https://disease.sh/v3/covid-19/all'
     :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);

      //All of the data...
      //from the country response
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    })
  }
  console.log("Country Info>>>>>>",countryInfo);
  
  return (
    <div className="app">
      <div className="app__left">
                {/* Header */}
            <div className="app__header">
              
              <h1>COVID-19 TRACKER </h1>
              
              {/* Title to select input dropdown feild */}
              <FormControl className="app__dropdown" >
                <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
                >
                <MenuItem value="worldwide" >Worldwide</MenuItem>

                {/* Loop through all countries and show a drop down list of the options */}
                {
                  countries.map((country)=>(
                    <MenuItem value={country.value}  >{country.name}</MenuItem>

                  ))
                }
                </Select>
              </FormControl>
              {/* </div> */}
          </div>

          <div className="app__stats">
                  
            {/* InfoBoxs title="coronavirus cases" */}
            <InfoBox 
            isRed
            onClick = {(e)=>setCasesType("cases")}
            active={casesType==="cases"}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
             />
            {/* InfoBoxs  title="coronavirus recovery cases" */}
            <InfoBox 
            onClick = {(e)=>setCasesType("recovered")}
            active={casesType==="recovered"}
            title="Recovered Cases"
             cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
              />
            {/* InfoBoxs title="death" */}
            <InfoBox
            isRed
            onClick = {(e)=>setCasesType("deaths")}
            active={casesType==="deaths"}
             title="Deaths"
             cases={prettyPrintStat(countryInfo.todayDeaths)} 
             total={prettyPrintStat(countryInfo.deaths)}
              />
          </div>


          {/* map */}
          <Map 
            countries={mapCountries} 
            casesType={casesType}
            center ={mapCenter}
            zoom={mapZoom}
          />

      </div>
      <Card className="app__right" >
                <CardContent>
                        
              {/* Table */}
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              {/* graph */}
              <h3 className="app__graphTitle" >Worldwide new {casesType} </h3>
                <LineGraph className="app__graph" casesType={casesType} />
                </CardContent>
      </Card>
    </div>
  );
}

export default App;
