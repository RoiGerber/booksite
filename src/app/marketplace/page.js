"use client";

import React, { useState, useMemo } from 'react';
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

const EventMap = ({ events, onEventSelect }) => (
  <div className="h-[70vh] bg-gray-100 rounded-lg relative">
    {/* Integrate your map component here */}
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-sm mb-2">Events Found: {events.length}</h3>
      {/* Add map controls/legend */}
    </div>
  </div>
);

const EventCard = ({ event }) => (
  <motion.div
    layout
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default function EventMarketplace() {
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    city: '',
    type: '',
    dateRange: {
      from: null,
      to: null,
    },
  });

  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState('date-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const regions = ['Jerusalem', 'North', 'Haifa', 'Center', 'Tel Aviv', 'South'];
  const cities = ['Seattle', 'Portland', 'San Francisco', 'Los Angeles'];
  const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Concert', 'Sports'];

  const sampleEvents = [
    {
      id: 1,
      name: 'Summer Wedding Celebration',
      type: 'Wedding',
      date: '2025-06-21',
      address: '123 Beach Blvd',
      city: 'San Francisco',
      region: 'California',
      contactName: 'Emily Johnson'
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      type: 'Corporate',
      date: '2025-03-15',
      address: '456 Innovation Way',
      city: 'Seattle',
      region: 'Washington',
      contactName: 'Michael Chen'
    },
    {
      id: 3,
      name: 'Rock Festival Weekend',
      type: 'Concert',
      date: '2025-07-04',
      address: '789 Music Lane',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Sarah Wilson'
    },
    {
      id: 4,
      name: 'Charity Gala Dinner',
      type: 'Corporate',
      date: '2025-05-20',
      address: '321 Charity Ave',
      city: 'New York',
      region: 'New York',
      contactName: 'David Miller'
    },
    {
      id: 5,
      name: 'Outdoor Adventure Wedding',
      type: 'Wedding',
      date: '2025-08-15',
      address: '555 Mountain Rd',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Rachel Green'
    },
    {
      id: 6,
      name: 'Pro Basketball Championship',
      type: 'Sports',
      date: '2025-06-10',
      address: '888 Arena Blvd',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Chris Thompson'
    },
    {
      id: 7,
      name: 'Vintage Car Exhibition',
      type: 'Corporate',
      date: '2025-09-05',
      address: '222 Classic Rd',
      city: 'San Francisco',
      region: 'California',
      contactName: 'Olivia Parker'
    },
    {
      id: 8,
      name: 'Sweet Sixteen Extravaganza',
      type: 'Birthday',
      date: '2025-04-12',
      address: '777 Party Lane',
      city: 'New York',
      region: 'New York',
      contactName: 'Sophia Martinez'
    },
    {
      id: 9,
      name: 'Jazz Night Under the Stars',
      type: 'Concert',
      date: '2025-07-25',
      address: '444 Jazz Ave',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Daniel White'
    },
    {
      id: 10,
      name: 'Startup Pitch Competition',
      type: 'Corporate',
      date: '2025-02-28',
      address: '999 Venture St',
      city: 'Seattle',
      region: 'Washington',
      contactName: 'Jennifer Lee'
    },
    {
      id: 11,
      name: 'Winter Wonderland Wedding',
      type: 'Wedding',
      date: '2025-12-12',
      address: '101 Snowflake Rd',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Ryan Frost'
    },
    {
      id: 12,
      name: 'Marathon Championship',
      type: 'Sports',
      date: '2025-10-10',
      address: '303 Fitness Way',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Michelle Carter'
    },
    {
      id: 13,
      name: 'Corporate Leadership Summit',
      type: 'Corporate',
      date: '2025-11-05',
      address: '606 Executive Blvd',
      city: 'San Francisco',
      region: 'California',
      contactName: 'Brian Taylor'
    },
    {
      id: 14,
      name: 'Electronic Dance Festival',
      type: 'Concert',
      date: '2025-08-20',
      address: '707 Bass Lane',
      city: 'New York',
      region: 'New York',
      contactName: 'Alex Johnson'
    },
    {
      id: 15,
      name: 'Golden Anniversary Party',
      type: 'Birthday',
      date: '2025-09-01',
      address: '888 Memory Lane',
      city: 'Seattle',
      region: 'Washington',
      contactName: 'Grace Wilson'
    },
    {
      id: 16,
      name: 'Beachside Wedding Ceremony',
      type: 'Wedding',
      date: '2025-07-10',
      address: '234 Ocean Dr',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Lucas Brown'
    },
    {
      id: 17,
      name: 'Food & Wine Conference',
      type: 'Corporate',
      date: '2025-04-18',
      address: '543 Culinary Ave',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Emma Davis'
    },
    {
      id: 18,
      name: 'Pro Tennis Open',
      type: 'Sports',
      date: '2025-05-30',
      address: '876 Court Rd',
      city: 'New York',
      region: 'New York',
      contactName: 'Kevin Adams'
    },
    {
      id: 19,
      name: 'Country Music Night',
      type: 'Concert',
      date: '2025-06-05',
      address: '321 Harmony St',
      city: 'San Francisco',
      region: 'California',
      contactName: 'Amanda Smith'
    },
    {
      id: 20,
      name: 'Surprise 40th Birthday',
      type: 'Birthday',
      date: '2025-03-22',
      address: '654 Celebration Way',
      city: 'Seattle',
      region: 'Washington',
      contactName: 'Nathan Young'
    },
    {
      id: 21,
      name: 'Mountain Retreat Wedding',
      type: 'Wedding',
      date: '2025-09-15',
      address: '789 Alpine Way',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Hannah Clark'
    },
    {
      id: 22,
      name: 'Tech Product Launch',
      type: 'Corporate',
      date: '2025-01-15',
      address: '432 Future St',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Ethan Moore'
    },
    {
      id: 23,
      name: 'Charity Basketball Match',
      type: 'Sports',
      date: '2025-02-14',
      address: '765 Hoops Ave',
      city: 'New York',
      region: 'New York',
      contactName: 'Jessica Hall'
    },
    {
      id: 24,
      name: 'Classical Symphony Night',
      type: 'Concert',
      date: '2025-04-05',
      address: '987 Orchestra Ln',
      city: 'San Francisco',
      region: 'California',
      contactName: 'William Brown'
    },
    {
      id: 25,
      name: 'Milestone 1st Birthday',
      type: 'Birthday',
      date: '2025-05-05',
      address: '111 Rainbow Rd',
      city: 'Portland',
      region: 'Oregon',
      contactName: 'Sophie Turner'
    },
    {
      id: 26,
      name: 'Vineyard Wedding Experience',
      type: 'Wedding',
      date: '2025-10-05',
      address: '222 Grapevine Way',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Oliver Martin'
    },
    {
      id: 27,
      name: 'Annual Shareholder Meeting',
      type: 'Corporate',
      date: '2025-12-01',
      address: '333 Finance Blvd',
      city: 'New York',
      region: 'New York',
      contactName: 'Natalie King'
    },
    {
      id: 28,
      name: 'Surfing Championship',
      type: 'Sports',
      date: '2025-08-08',
      address: '444 Wave Cr',
      city: 'San Francisco',
      region: 'California',
      contactName: 'Jake Wilson'
    },
    {
      id: 29,
      name: 'Indie Music Festival',
      type: 'Concert',
      date: '2025-07-18',
      address: '555 Alternative Way',
      city: 'Seattle',
      region: 'Washington',
      contactName: 'Lily Adams'
    },
    {
      id: 30,
      name: 'Quinceañera Celebration',
      type: 'Birthday',
      date: '2025-11-20',
      address: '666 Tradition St',
      city: 'Los Angeles',
      region: 'California',
      contactName: 'Maria Garcia'
    }
  ];

  const events = sampleEvents;

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1); // Reset to the first page when filters change

    // Handle active filters
    if (type === 'dateRange') {
      const isActive = value.from && value.to;
      setActiveFilters((prev) => {
        if (isActive && !prev.includes(type)) {
          return [...prev, type];
        } else if (!isActive && prev.includes(type)) {
          return prev.filter((f) => f !== type);
        }
        return prev;
      });
    } else {
      setActiveFilters((prev) => {
        if (value && !prev.includes(type)) {
          return [...prev, type];
        } else if (!value && prev.includes(type)) {
          return prev.filter((f) => f !== type);
        }
        return prev;
      });
    }
  };

  const removeFilter = (type) => {
    if (type === 'dateRange') {
      handleFilterChange(type, { from: null, to: null });
    } else {
      handleFilterChange(type, '');
    }
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesSearch =
          !filters.search ||
          event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.type.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.city.toLowerCase().includes(filters.search.toLowerCase());

        const matchesRegion = !filters.region || event.region === filters.region;
        const matchesCity = !filters.city || event.city === filters.city;
        const matchesType = !filters.type || event.type === filters.type;

        const eventDate = new Date(event.date);
        const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;

        const matchesDateRange =
          (!fromDate && !toDate) ||
          (fromDate && toDate && eventDate >= fromDate && eventDate <= toDate);

        return matchesSearch && matchesRegion && matchesCity && matchesType && matchesDateRange;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [events, filters, sortOrder]);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (filteredEvents.length > itemsPerPage) {
      return (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      );
    }
    return null;
  };

  const filterLabels = {
    search: 'Search',
    region: 'Region',
    city: 'City',
    type: 'Event Type',
    dateRange: 'Date Range',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-3">
          Photography Events
        </h1>
        <p className="text-gray-600">
          Browse and accept photography opportunities in your area
        </p>
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <Select onValueChange={(value) => handleFilterChange('region', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from
                    ? filters.dateRange?.to
                      ? `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`
                      : filters.dateRange.from.toLocaleDateString()
                    : 'Select dates'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from || new Date()}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to
                  }}
                  onSelect={(range) => {
                    const validatedRange = {
                      from: range?.from || null,
                      to: range?.to || null,
                    };
                    handleFilterChange('dateRange', validatedRange);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => {
                let valueText;
                if (filter === 'dateRange') {
                  const from = filters.dateRange.from?.toLocaleDateString();
                  const to = filters.dateRange.to?.toLocaleDateString();
                  valueText = from && to ? `${from} - ${to}` : '';
                } else {
                  valueText = filters[filter];
                }

                return (
                  <Badge key={filter} variant="secondary" className="px-3 py-1">
                    {filterLabels[filter]}: {valueText}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => removeFilter(filter)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({
                    search: '',
                    region: '',
                    city: '',
                    type: '',
                    dateRange: { from: null, to: null },
                  });
                  setActiveFilters([]);
                  setCurrentPage(1); // Reset to the first page
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* View Toggle and Sort */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('grid')}
              className={`${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
            >
              <ListIcon className="w-4 h-4 mr-2" />
              Grid View
            </Button>
            <Button
              onClick={() => setViewMode('map')}
              className={`${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
          <Select defaultValue="date-asc" onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date: Earliest first</SelectItem>
              <SelectItem value="date-desc">Date: Latest first</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              layout
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <EventMap
                events={currentEvents}
                onEventSelect={(event) => console.log('Selected:', event)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {renderPagination()}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">No events match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setFilters({
                  search: '',
                  region: '',
                  city: '',
                  type: '',
                  dateRange: { from: null, to: null },
                });
                setActiveFilters([]);
                setCurrentPage(1); // Reset to the first page
              }}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}