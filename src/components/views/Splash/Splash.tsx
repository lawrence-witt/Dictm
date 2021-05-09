import React from 'react';

import SplashHero from './sections/Hero/SplashHero';
import SplashFeatures from './sections/Features/SplashFeatures';
import SplashReleases from './sections/Releases/SplashReleases';
import Footer from '../../organisms/Footer/Footer';

const Splash: React.FC = () => {
    const expandAnchor = React.useRef<HTMLSpanElement>(null);

    const onExpandClick = React.useCallback(() => {
        if (expandAnchor.current) expandAnchor.current.scrollIntoView({behavior: 'smooth'});
    }, []);

    return (
        <div style={{width: '100%'}}>
            <SplashHero onExpandClick={onExpandClick}/>
            <span ref={expandAnchor}></span>
            <SplashFeatures />
            <SplashReleases />
            <Footer/>
        </div>
    )
}

export default Splash;