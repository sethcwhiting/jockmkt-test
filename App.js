import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, View, Image, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const logo = require('./assets/logo.png');
const jmdata = require('./data/eventstocks.json');

const eventStocks = jmdata.event_stocks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 0,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        borderColor: '#ccc',
        borderBottomWidth: 1,
    },
    search: {
        flex: 1,
        paddingVertical: 7,
        paddingHorizontal: 12,
        fontSize: 18,
        backgroundColor: '#eee',
        borderRadius: 20,
    },
    inputWrap: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    item: {
        padding: 20,
        flexDirection: 'row',
        borderColor: '#ccc',
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#06b17f',
    },
    stat: {
        fontSize: 18,
    },
});

export default function App() {
    const [selectedValue, setSelectedValue] = useState('pfpd');
    const [searchValue, setSearchValue] = useState('');
    const [stockData, setStockData] = useState(eventStocks);
    const [selectedStock, setSelectedStock] = useState(null);

    const curateData = args => {
        let newData = eventStocks;
        if (args.search) newData = newData.filter(data => data.stock && data.stock.name.toLowerCase().includes(args.search.toLowerCase()));
        switch (args.sort) {
            case 'pfpd':
                newData = newData.sort((a, b) => b.fantasy_points_projected - a.fantasy_points_projected);
                break;
            case 'pfpa':
                newData = newData.sort((a, b) => a.fantasy_points_projected - b.fantasy_points_projected);
                break;
            case 'afpd':
                newData = newData.sort((a, b) => b.fantasy_points_scored - a.fantasy_points_scored);
                break;
            case 'afpa':
                newData = newData.sort((a, b) => a.fantasy_points_scored - b.fantasy_points_scored);
                break;
            case 'ltpd':
                newData = newData.sort((a, b) => b.last_price - a.last_price);
                break;
            case 'ltpa':
                newData = newData.sort((a, b) => a.last_price - b.last_price);
                break;
            default:
                break;
        }
        setStockData(newData);
    };

    const ListHeader = () => (
        <View style={styles.header}>
            <Image source={logo} style={{ width: 242.5, height: 125 }} />
            <View style={styles.inputWrap}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 20 }}>Search:</Text>
                <TextInput onBlur={({ nativeEvent: { text } }) => curateData({ search: text })} placeholder="Search" style={styles.search} />
            </View>
            <View style={styles.inputWrap}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginRight: 20 }}>Sort By:</Text>
                <RNPickerSelect
                    onValueChange={sort => {
                        setSelectedValue(sort);
                        curateData({ sort });
                    }}
                    value={selectedValue}
                    textInputProps={{ style: { fontSize: 20, color: '#06b17f' } }}
                    items={[
                        { label: 'Projected Fantasy Points (desc)', value: 'pfpd' },
                        { label: 'Projected Fantasy Points (asc)', value: 'pfpa' },
                        { label: 'Actual Fantasy Points (desc)', value: 'afpd' },
                        { label: 'Actual Fantasy Points (asc)', value: 'afpa' },
                        { label: 'Last Trade Price (desc)', value: 'ltpd' },
                        { label: 'Last Trade Price (asc)', value: 'ltpa' },
                    ]}
                />
            </View>
        </View>
    );

    const Item = ({ data }) => (
        <TouchableOpacity style={styles.item} onPress={() => setSelectedStock(data)}>
            <View style={{ width: 70, height: 70, backgroundColor: '#eeffe5', borderRadius: 35, overflow: 'hidden' }}>
                <Image source={{ uri: data.stock && data.stock.image_url }} style={{ width: 70, height: 70 }} />
            </View>
            <View style={{ flex: 1, paddingLeft: 20 }}>
                <Text style={styles.name}>{data.stock && data.stock.name}</Text>
                <Text style={styles.stat}>
                    <Text style={{ fontWeight: 'bold' }}>Projected Fantasy Points:</Text> {data.fantasy_points_projected}
                </Text>
                <Text style={styles.stat}>
                    <Text style={{ fontWeight: 'bold' }}>Actual Fantasy Points:</Text> {data.fantasy_points_scored}
                </Text>
                <Text style={styles.stat}>
                    <Text style={{ fontWeight: 'bold' }}>Last Trade Price:</Text> {data.last_price}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {(!selectedStock && (
                <FlatList
                    data={stockData}
                    style={{ width: '100%' }}
                    ListHeaderComponent={() => <ListHeader />}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Item data={item} />}
                />
            )) || (
                <View style={{ flex: 1, width: '100%', padding: 15 }}>
                    <View>
                        <TouchableOpacity onPress={() => setSelectedStock(null)}>
                            <Text style={{ color: '#06b17f', fontSize: 22 }}>{'< Back'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <View style={{ width: 140, height: 140, backgroundColor: '#eeffe5', borderRadius: 70, overflow: 'hidden' }}>
                            {/* eslint-disable-next-line camelcase */}
                            <Image source={{ uri: selectedStock?.stock.image_url }} style={{ width: 140, height: 140 }} />
                        </View>
                        {console.log(selectedStock?.stock.name)}
                        <View style={{ flex: 1, width: '100%' }}>
                            <Text style={{ fontSize: 36, color: '#06b17f', textAlign: 'center', fontWeight: 'bold', lineHeight: 80 }}>
                                {selectedStock.stock?.name}
                            </Text>
                            <View style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#eee', marginVertical: 15 }}>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    {/* eslint-disable-next-line camelcase */}
                                    <Text style={{ fontWeight: 'bold' }}>Current Team:</Text> {selectedStock.stock?.details?.current_team}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Position:</Text> {selectedStock.stock?.details?.position}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    {/* eslint-disable-next-line camelcase */}
                                    <Text style={{ fontWeight: 'bold' }}>Jersey Number:</Text> {selectedStock.stock?.details?.jersey_number}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Height:</Text> {selectedStock.stock?.details?.height}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Weight:</Text> {selectedStock.stock?.details?.weight}
                                </Text>
                                <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                    {/* eslint-disable-next-line camelcase */}
                                    <Text style={{ fontWeight: 'bold' }}>Rookie Year:</Text> {selectedStock.stock?.details?.rookie_year}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                <Text style={{ fontWeight: 'bold' }}>Projected Fantasy Points:</Text> {selectedStock.fantasy_points_projected}
                            </Text>
                            <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                <Text style={{ fontWeight: 'bold' }}>Actual Fantasy Points:</Text> {selectedStock.fantasy_points_scored}
                            </Text>
                            <Text style={{ fontSize: 24, lineHeight: 36 }}>
                                <Text style={{ fontWeight: 'bold' }}>Last Trade Price:</Text> {selectedStock.last_price}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
