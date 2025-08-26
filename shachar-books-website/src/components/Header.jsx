import styles from '../components/Header.module.css';
function Header(){
    return(
        <>
         <header className={styles.center}>
            <h1>אתר דירוג הספרים הגדול</h1>
         </header>
         <hr /> 
        </>
    );
}

export default Header