import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import plants from '../constants/plants';
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const Plants = () => {
    const navigation = useNavigation();
    const [expandedPlant, setExpandedPlant] = useState(null);

    const handleMore = (plant) => {
        if (expandedPlant === plant) {
            setExpandedPlant(null);
        } else {
            setExpandedPlant(plant);
        }
    };

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Plants and care</Text>

                <ScrollView style={{width: '100%'}}>
                    {
                        plants.map((plant, index) => (
                            <View key={index} style={[styles.card, { height: expandedPlant === plant ? 165 : 75 }]}>
                                <Text style={styles.name}>{plant.name}</Text>
                                <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}> 
                                    <Text style={[styles.text, expandedPlant === plant && { marginBottom: 5 }]}>Care tips</Text>
                                    <TouchableOpacity style={styles.moreIcon} onPress={() => handleMore(plant)}>
                                        <Icons type={'more-info'} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    expandedPlant === plant && (
                                        plant.tips.map((tip, index) => (
                                            <Text key={index} style={styles.tip}>- {tip}</Text>
                                        ))
                                    )
                                }
                            </View>
                        ))
                    }
                </ScrollView>

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    back: {
        width: 23,
        height: 33,
        position: 'absolute',
        top: height * 0.065,
        left: 20
    },

    card: {
        width: '100%',
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 20
    },

    name: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 5,
        lineHeight: 22
    },

    text: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '400',
        lineHeight: 14.63
    },

    tip: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '400',
        opacity: 0.5
    },

    moreIcon: {
        width: 33,
        height: 27,
        padding: 10,
        marginRight: -10
    }

});

export default Plants;