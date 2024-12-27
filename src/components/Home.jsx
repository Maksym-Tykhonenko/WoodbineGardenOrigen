import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const Home = () => {
    const navigation = useNavigation(); 

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <Text style={styles.title}>Home</Text>

                <View style={styles.btnsContainer}>

                    <View style={styles.btn}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image style={styles.image} source={require('../assets/home/1.png')} />
                            <Text style={styles.btnText}>Garden Dreams</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowIcon} onPress={() => navigation.navigate('DreamsScreen')}>
                            <Icons type={'arrow'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.btn}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image style={styles.image} source={require('../assets/home/2.png')} />
                            <Text style={styles.btnText}>Gardening Projects</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowIcon} onPress={() => navigation.navigate('ProjectsScreen')}>
                            <Icons type={'arrow'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.btn}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image style={styles.image} source={require('../assets/home/3.png')} />
                            <Text style={styles.btnText}>Plants and care</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowIcon} onPress={() => navigation.navigate('PlantsScreen')}>
                            <Icons type={'arrow'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.btn}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image style={styles.image} source={require('../assets/home/4.png')} />
                            <Text style={styles.btnText}>Green Desires</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowIcon} onPress={() => navigation.navigate('DesiresScreen')}>
                            <Icons type={'arrow'} />
                        </TouchableOpacity>
                    </View>
                    
                </View>

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

    btnsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    btn: {
        width: '48%',
        borderRadius: 14,
        backgroundColor: '#2b2b2b',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 9,
        marginBottom: 12
    },

    image: {
        borderRadius: 10,
        width: 70,
        height: 63,
        resizeMode: 'cover',
        marginBottom: 6
    },

    btnText: {
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        textAlign: 'center'
    },

    arrowIcon: {
        width: 44,
        height: 44,
        position: 'absolute',
        top: 0,
        right: 0
    }

});

export default Home;