import React from 'react';
import { motion } from 'framer-motion';


function RightBottom() {
    const images = [
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/allianz.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/wilson.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/ogilvy.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/apple.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/versace.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/allianz.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/wilson.svg?auto=format" },
        { url: "https://artlist-dev.imgix.net/artlist/trusted_companies_logos/company/framed/ogilvy.svg?auto=format" }
    ];
        
    return (
        <div className='bottom'>
            <div className="text">
                <motion.h1 
                    className="title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Get royalty-free music for your videos
                </motion.h1>
                
                <motion.span 
                    className="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Explore copyright-free music with music licensing that covers any kind of project, 
                    from social media to commercial use worldwide.
                </motion.span>
                
                <motion.div 
                    className="button-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <button className="primary-button">Start Free Now</button>
                    <button className="secondary-button">Pricing</button>
                </motion.div>
            </div>
            
            <motion.div 
                className="trusted-brands"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <p>Trusted by the world's best creators</p>
                <div className="brand-logos">
                    {images.map((image, index) => (
                        <motion.img 
                            src={image.url} 
                            alt="Trusted brand" 
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default RightBottom;