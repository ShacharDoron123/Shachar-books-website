import styles from '../components/Footer.module.css';
function Footer(){
    return(
    <footer>
      <hr/>
      <div className={styles.div}>
         <p className={styles.p}>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
      <hr />
    </footer>
    );
}

export default Footer