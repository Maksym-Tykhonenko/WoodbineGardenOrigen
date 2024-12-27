import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert, ImageBackground } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const { height, width } = Dimensions.get('screen');

const Dreams = () => {
    const navigation = useNavigation(); 
    const [addPressed, setAddPressed] = useState(false);
    const [calendar, setCalendar] = useState(false);
    const [wish, setWish] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(null);
    const [budget, setBudget] = useState(null);
    const [dreams, setDreams] = useState([]);
    const [active, setActive] = useState('inprogress');

    const [wishError, setWishError] = useState('');
    const [descError, setDescError] = useState('');
    const [dateError, setDateError] = useState('');
    const [budgetError, setBudgetError] = useState('');

    const loadDreams = useCallback(async () => {
        try {
            const savedDreams = await AsyncStorage.getItem('dreams');
            if (savedDreams) {
                setDreams(JSON.parse(savedDreams));
            }
        } catch (error) {
            console.error("Error loading dreams:", error);
        }
    }, []);

    useEffect(() => {
        loadDreams()
    }, [!addPressed])

    useFocusEffect(
        useCallback(() => {
            loadDreams();
        }, [loadDreams])
    );

    const inProgressDreams = dreams.filter((dream) => dream.inprogress);
    const doneDreams = dreams.filter((dream) => dream.done);

    const activeDreams = active === 'inprogress' ? inProgressDreams : doneDreams;

    const handleDayPress = (day) => {
        const rawDate = new Date(day.dateString);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${rawDate.getFullYear()}`;
        setDate(formattedDate);
        setCalendar(false);
        setDescError('');
    };    

    const submitDream = async () => {
        let valid = true;

        setWishError('');
        setDescError('');
        setDateError('');
        setBudgetError('');

        if (!wish) {
            setWishError('Wish cannot be empty.');
            valid = false;
        }
        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }
        if (!date) {
            setDateError('Please select a date.');
            valid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            if (selectedDate <= today) {
                setDateError('Please select a future date.');
                valid = false;
            }
        }
        if (!budget) {
            setBudgetError('Budget cannot be empty.');
            valid = false;
        }

        if (!valid) return;

        const newDream = {
            wish,
            desc,
            date,
            budget,
            id: Date.now(),
            inprogress: true,
            done: false
        };

        try {
            const existingDreams = await AsyncStorage.getItem('dreams');
            const dreamsArray = existingDreams ? JSON.parse(existingDreams) : [];
            dreamsArray.push(newDream);

            await AsyncStorage.setItem('dreams', JSON.stringify(dreamsArray));
            Alert.alert("Success", "Dream added successfully!");

            setWish('');
            setDesc('');
            setDate(null);
            setBudget('');
            setAddPressed(false);
        } catch (error) {
            console.error("Error saving dream:", error);
            Alert.alert("Error", "Failed to save dream. Please try again.");
        }
    };

    const handleDeleteDream = async (id) => {
        const updatedDreams = dreams.filter((dream) => dream.id !== id);
        setDreams(updatedDreams);
        await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
    };    

    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Garden Dreams</Text>

                {
                    addPressed ? (
                        <View style={{width: '100%'}}>
                            <ScrollView style={{width: '100%'}}>

                                <TextInput
                                    value={wish}
                                    placeholder='Your wish'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    onChangeText={(w) => setWish(w)}
                                    style={styles.input}
                                />
                                {wishError ? <Text style={styles.error}>{wishError}</Text> : null}

                                <TextInput
                                    value={desc}
                                    placeholder='Description'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    onChangeText={(d) => setDesc(d)}
                                    multiline={true}
                                    style={[styles.input, {height: 100}]}
                                />
                                {descError ? <Text style={styles.error}>{descError}</Text> : null}

                                <View style={{width: '100%'}}>
                                    <TextInput
                                        value={date}
                                        placeholder='Date'
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        style={[styles.input, {paddingLeft: 44}]}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.calendarIcon} onPress={() => setCalendar(true)}>
                                        <Icons type={'calendar'} />
                                    </TouchableOpacity>
                                </View>
                                {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

                                {
                                    calendar && (
                                        <Calendar
                                            style={{ width: width * 0.89, borderRadius: 12, marginBottom: 10 }}
                                            onDayPress={handleDayPress}
                                            markedDates={{
                                                [date]: { selected: true, selectedColor: '#ff0004' },
                                            }}
                                            theme={{
                                                selectedDayBackgroundColor: '#ff0004',
                                                todayTextColor: '#ff0004',
                                                arrowColor: '#ff0004',
                                                textDayFontWeight: '500',
                                                textMonthFontWeight: 'bold',
                                                textDayHeaderFontWeight: '500',
                                            }}
                                        />
                                    )
                                }
                                <TextInput
                                    value={budget ? `${budget} $` : ''}
                                    placeholder='Planned budget'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    onChangeText={(b) => {
                                        const numericValue = b.replace(/[^0-9]/g, '');
                                        setBudget(numericValue);
                                    }}
                                    style={styles.input}
                                />
                                {budgetError ? <Text style={styles.error}>{budgetError}</Text> : null}

                                <View style={{height: 200}} />
                            </ScrollView>
                        </View>
                    ) : (
                        dreams.length > 0 ? (
                            <View style={{width: '100%'}}>

                                <View style={styles.stateBtnsContainer}>
                                    <TouchableOpacity style={[styles.stateBtn, {marginRight: 15}, active === 'inprogress' && {backgroundColor: '#ed2124'}]} onPress={() => setActive('inprogress')}>
                                        <Text style={[styles.stateBtnText, active === 'done' && {opacity: 0.5}]}>In progress</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.stateBtn, active === 'done' && {backgroundColor: '#ed2124'}]} onPress={() => setActive('done')}>
                                        <Text style={[styles.stateBtnText, active === 'inprogress' && {opacity: 0.5}]}>Finished</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={{width: '100%'}}>
                                    <SwipeListView
                                        data={activeDreams}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DreamDetailsScreen', {dream: item})}>
                                                <Text style={styles.wish}>{item.wish}</Text>
                                                <Text style={styles.date}>{item.date}</Text>
                                                <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{item.desc}</Text>
                                                <Text style={styles.budget}>{item.budget} $</Text>
                                            </TouchableOpacity>
                                        )}
                                        renderHiddenItem={({ item }) => (
                                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDream(item.id)}>
                                                <Icons type={'delete'} />
                                            </TouchableOpacity>
                                        )}
                                        rightOpenValue={-80}
                                        disableRightSwipe={true}
                                    />

                                    <View style={{height: 170}} />
                                </ScrollView>

                            </View>
                        ) : (
                            <View style={styles.noContainer}>
                                <Image style={styles.image} source={require('../assets/decor/dreams.png')} />
                                <Text style={styles.noTitle}>Nothing added yet</Text>
                                <Text style={styles.noText}>Click on the button below to add a dream garden</Text>
                            </View>    
                        )
                    )
                }

                <TouchableOpacity style={styles.addBtn} onPress={() => (addPressed ? submitDream() : setAddPressed(true))}>
                    <View style={styles.addIcon}>
                        <Icons type={'add'} />
                    </View>
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>

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

    noContainer: {
        width: '100%',
        paddingVertical: 26,
        paddingHorizontal: 45,
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        marginTop: height * 0.03
    },

    image: {
        width: 112,
        height: 174,
        marginBottom: height * 0.035
    },

    noTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    noText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
        opacity: 0.5
    },

    addBtn: {
        position: 'absolute',
        bottom: height * 0.05,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    addIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    addBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    calendarIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 14,
        left: 10
    },

    input: {
        width: '100%',
        paddingVertical: 17,
        paddingHorizontal: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        textAlignVertical: 'top'
    },

    error: {
        color: '#ff0004',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    },

    stateBtnsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },

    stateBtn: {
        width: 128,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 72,
        backgroundColor: '#2b2b2b'
    },

    stateBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff'
    },

    card: {
        with: '100%',
        height: 160,
        alignItems: 'flex-start',
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 20
    },

    wish: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 8,
        lineHeight: 22 
    },

    date: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 8,
        lineHeight: 14.63
    },

    description: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        opacity: 0.5,
        marginBottom: 8,
        lineHeight: 14.63,
        overflow: 'hidden',
        height: 45
    },

    budget: {
        fontSize: 25,
        fontWeight: '900',
        color: '#ed2124',
        lineHeight: 30.48
    },

    deleteButton: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: '50%',
        right: 20
    }

});

export default Dreams;