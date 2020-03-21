import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    maxWidth: 325,
  },

});

export default function ArticleCard({img, price, id, title, city, state, link}) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={id}
          height="240"
          width="180"
          image={img}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography gutterBottom variant="h5" component="h5">
           ${price}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {city}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {state}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Guardar a Fav
        </Button>
        <Button size="small" color="primary">
         <a href={link}>Ver</a>
        </Button>
      </CardActions>
    </Card>
  );
}