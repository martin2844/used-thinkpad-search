import React from 'react'
import img from '../images/computadora.png'
import Button from '@material-ui/core/Button';
import Github from '../components/Github';
import { Link } from '@reach/router';


const Home = () => {

    return (

        <div className="content-wrapper flex-center">
            <div className="welcome">
                <img src={img} />
                <div>
                    <h1>BIENVENIDOS</h1>
                    <h3>Used hardware search es una plataforma para facilitar la busqueda de hardware usado en mercadolibre</h3>
                    <Button component={Link} to="/search" variant="outlined" color="primary">
                        Probalo!
                    </Button>
                </div>
           
            </div>
            <Github />
        </div>
    )
}

export default Home
