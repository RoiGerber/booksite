"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  SearchIcon,
  MapPinIcon,
  CameraIcon,
  ListIcon,
  MapIcon,
  XIcon,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// API configuration
const api_url = 'https://data.gov.il/api/3/action/datastore_search';
const cities_resource_id = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
const city_name_key = 'שם_ישוב';

// Helper function to fetch cities
const fetchCities = async () => {
  const response = await axios.get(api_url, {
    params: { resource_id: cities_resource_id, limit: 32000 },
  });
  const records = response.data.result.records;
  const cityNames = records.map((record) => record[city_name_key].trim());
  return cityNames;
};

// Helper function to get coordinates for cities in Israel
const getCoordinatesForCity = (city) => {
  const cityCoordinates = {
    'Jerusalem': [31.7683, 35.2137],
    'Tel Aviv': [32.0853, 34.7818],
    'Haifa': [32.7940, 34.9896],
    'Beer Sheva': [31.2518, 34.7913],
    'Eilat': [29.5577, 34.9519],
  };
  return cityCoordinates[city] || [31.0461, 34.8516];
};

// Israel Map Component
const IsraelMap = ({ events }) => {
  return (
    <MapContainer
      center={[31.0461, 34.8516]}
      zoom={7}
      style={{ height: '70vh', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {events.map((event) => (
        <Marker
          // key={event.id}
          position={getCoordinatesForCity(event.city)}
        >
          <Popup>
            <div className="font-medium">{event.name}</div>
            <div className="text-sm">{event.city}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// EventCard Component
const EventCard = ({ event }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative border rounded-lg p-6 bg-white shadow-md hover:scale-105 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="font-bold text-xl text-indigo-800">{event.name}</h2>
        <p className="text-gray-600">{event.type}</p>
      </div>
      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
        <CameraIcon className="w-4 h-4 mr-2" />
        Accept Job
      </Button>
    </div>
    <div className="space-y-2">
      <div className="flex items-center text-gray-600">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="flex items-center text-gray-600">
        <MapPinIcon className="w-4 h-4 mr-2" />
        {event.address}, {event.city}, {event.region}
      </div>
      <div className="mt-4">
        <span className="font-medium">Contact: </span>
        {event.contactName}
      </div>
    </div>
  </motion.div>
);

export default function EventMarketplace() {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    type: '',
    dateRange: { from: null, to: null },
  });

  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState('date-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Concert', 'Sports'];
  
  const sampleEvents = [
    // ... (keep your sample events data)
  ];

  const events = sampleEvents;

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityNames = await fetchCities();
        setCities(cityNames);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const searchMatch = !filters.search || 
        event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.city.toLowerCase().includes(filters.search.toLowerCase());

      const cityMatch = !filters.city ||
        event.city.toLowerCase().includes(filters.city.toLowerCase());

      const dateFrom = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const dateTo = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
      const eventDate = new Date(event.date);
      
      const dateMatch = (!dateFrom && !dateTo) || 
        (eventDate >= dateFrom && eventDate <= dateTo);

      return searchMatch && cityMatch && dateMatch;
    }).sort((a, b) => {
      // ... (keep sorting logic)
    });
  }, [events, filters, sortOrder]);

  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8">
      {/* Header and Filters */}

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Grid View */}
          <motion.div
            className="relative"
            animate={{ 
              opacity: viewMode === 'grid' ? 1 : 0,
              pointerEvents: viewMode === 'grid' ? 'auto' : 'none'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.div>

          {/* Map View (always rendered) */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            animate={{ 
              opacity: viewMode === 'map' ? 1 : 0,
              pointerEvents: viewMode === 'map' ? 'auto' : 'none'
            }}
          >
            <IsraelMap events={currentEvents} />
          </motion.div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'default' : 'outline'}
          >
            <ListIcon className="w-4 h-4 mr-2" />
            Grid View
          </Button>
          <Button
            onClick={() => setViewMode('map')}
            variant={viewMode === 'map' ? 'default' : 'outline'}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Map View
          </Button>
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverContent className="z-[1000]"> {/* Ensure it's above map */}
            <Calendar
              mode="range"
              selected={filters.dateRange}
              onSelect={(range) => setFilters(prev => ({
                ...prev,
                dateRange: { from: range?.from, to: range?.to }
              }))}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}