import React from 'react';

import SplashHero from './sections/Hero/SplashHero';
import SplashFeatures from './sections/Features/SplashFeatures';
import SplashReleases from './sections/Releases/SplashReleases';
import Footer from '../../organisms/Footer/Footer';

const Splash: React.FC = () => {
    return (
        <div style={{width: '100%'}}>
            <SplashHero/>
            <SplashFeatures />
            <SplashReleases />
            <Footer/>
        </div>
    )
}

export default Splash;