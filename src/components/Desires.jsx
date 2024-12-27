import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert, ImageBackground } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const { height, width } = Dimensions.get('screen');

const Desires = () => {
    const navigation = useNavigation(); 
    const [addPressed, setAddPressed] = useState(false);
    const [calendar, setCalendar] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingDate, setSelectingDate] = useState('start');
    const [desires, setDesires] = useState([]);
    const [active, setActive] = useState('inprogress');

    const [titleError, setTitleError] = useState('');
    const [descError, setDescError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');

    const loadDesires = useCallback(async () => {
        try {
            const savedDesires = await AsyncStorage.getItem('desires');
            if (savedDesires) {
                setDesires(JSON.parse(savedDesires));
            }
        } catch (error) {
            console.error("Error loading desires:", error);
        }
    }, []);

    useEffect(() => {
        loadDesires()
    }, [!addPressed])

    useFocusEffect(
        useCallback(() => {
            loadDesires();
        }, [loadDesires])
    );

    const inProgressDesires = desires.filter((desire) => desire.inprogress);
    const doneDesired = desires.filter((desire) => desire.done);

    const activeDesires = active === 'inprogress' ? inProgressDesires : doneDesired;

    const handleDayPress = (day) => {
        const rawDate = new Date(day.dateString);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${rawDate.getFullYear()}`;
    
        if (selectingDate === 'start') {
            setStartDate(formattedDate);
        } else if (selectingDate === 'end') {
            setEndDate(formattedDate);
        }
    
        setCalendar(false);
    };   

    const submitDesire = async () => {
        let valid = true;

        setTitleError('');
        setDescError('');
        setStartDateError('');
        setEndDateError('');

        if (!title) {
            setTitleError('Title cannot be empty.');
            valid = false;
        }

        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }

        if (!startDate) {
            setStartDateError('Please select a start date.');
            valid = false;
        }
        
        if (!endDate) {
            setEndDateError('Please select an end date.');
            valid = false;
        } else {
            const start = new Date(startDate.split('.').reverse().join('-'));
            const end = new Date(endDate.split('.').reverse().join('-'));
        
            if (start >= end) {
                setStartDateError('Start date must be before end date.');
                valid = false;
            }
        
            const today = new Date();
            if (end <= today) {
                setEndDateError('End date must be in the future.');
                valid = false;
            }
        }

        if (!valid) {
            console.log("Form validation failed!");
            return;
        }        

        const newDesire = {
            title,
            desc,
            startDate,
            endDate,
            id: Date.now(),
            inprogress: true,
            done: false
        };

        try {
            const existingDesires = await AsyncStorage.getItem('desires');
            const desiresArray = existingDesires ? JSON.parse(existingDesires) : [];
            desiresArray.push(newDesire);

            await AsyncStorage.setItem('desires', JSON.stringify(desiresArray));
            Alert.alert("Success", "Desire added successfully!");

            setTitle('');
            setDesc('');
            setStartDate(null);
            setEndDate(null);

            setAddPressed(false);

        } catch (error) {
            console.error("Error saving desire:", error);
            Alert.alert("Error", "Failed to save desire. Please try again.");
        }
    };

    const handleDeleteDesire = async (id) => {
        const updatedDesires = desires.filter((desire) => desire.id !== id);
        setDesires(updatedDesires);
        await AsyncStorage.setItem('desires', JSON.stringify(updatedDesires));
    };  
    
    return (
        <ImageBackground source={require('../assets/back/back.png')} style={{flex:1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                    <Icons type={'back'} />
                </TouchableOpacity>

                <Text style={styles.title}>Green desires</Text>

                {
                    addPressed ? (
                        <View style={{width: '100%'}}>
                            <ScrollView style={{width: '100%'}}>

                                <TextInput
                                    value={title}
                                    placeholder='Title'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    onChangeText={(w) => setTitle(w)}
                                    style={styles.input}
                                />
                                {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

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
                                        value={startDate}
                                        placeholder='Start date'
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        style={[styles.input, {paddingLeft: 44}]}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.calendarIcon} onPress={() => { setSelectingDate('start'); setCalendar(true); }}>
                                        <Icons type={'calendar'} />
                                    </TouchableOpacity>
                                </View>
                                {startDateError ? <Text style={styles.error}>{startDateError}</Text> : null}

                                <View style={{width: '100%'}}>
                                    <TextInput
                                        value={endDate}
                                        placeholder='End date'
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        style={[styles.input, {paddingLeft: 44}]}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.calendarIcon} onPress={() => { setSelectingDate('end'); setCalendar(true); }}>
                                        <Icons type={'calendar'} />
                                    </TouchableOpacity>
                                </View>
                                {endDateError ? <Text style={styles.error}>{endDateError}</Text> : null}

                                {
                                    calendar && (
                                        <Calendar
                                            style={{ width: width * 0.89, borderRadius: 12, marginBottom: 10 }}
                                            onDayPress={handleDayPress}
                                            markedDates={{
                                                [startDate]: { selected: selectingDate === 'start', selectedColor: '#ff0004' },
                                                [endDate]: { selected: selectingDate === 'end', selectedColor: '#ff0004' },
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

                                <View style={{height: 200}} />
                            </ScrollView>
                        </View>
                    ) : (
                        desires.length > 0 ? (
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
                                        data={activeDesires}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DesireDetailsScreen', {desire: item})}>
                                                <Text style={styles.cardTitle}>{item.title}</Text>
                                                <Text style={styles.date}>{item.startDate} - {item.endDate}</Text>
                                                <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{item.desc}</Text>
                                            </TouchableOpacity>
                                        )}
                                        renderHiddenItem={({ item }) => (
                                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDesire(item.id)}>
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
                                <Text style={styles.noText}>Click on the button below to add a garden desire</Text>
                            </View>    
                        )
                    )
                }

                <TouchableOpacity style={styles.addBtn} onPress={() => {
                        if (addPressed) {
                            console.log('Submitting project...');
                            submitDesire();
                        } else {
                            console.log('Add button pressed');
                            setAddPressed(true);
                        }
                    }}
                    >
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

    cardTitle: {
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
    },

    planText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 8,
    },

    imageUploadBtn: {
        width: '100%',
        height: 248,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2b2b2b'
    }

});

export default Desires;