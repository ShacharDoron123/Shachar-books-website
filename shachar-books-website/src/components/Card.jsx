import Rating from "./Rating";

function Card(props){
    return(
       <div className="card">
            <div className="image-container">
                <img className="card-image" src={props.src} alt={props.alt} />
            </div>
            <h2 className="card-title">{props.name}</h2>
            <p className="card-text">{props.p}</p>
            <Rating Ename={props.Ename} edit="false"/>
       </div> 
    );
}
export default Card;
