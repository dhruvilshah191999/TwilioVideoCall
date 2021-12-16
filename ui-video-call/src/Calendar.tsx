import Calender from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICalendarEvent {
  id?: any;
  title?: string;
  start?: any;
  end?: any;
  color?: string;
  rendering?: string;
  display?: string;
  extendedProps?: any;
}

interface IFullCalendarProps {
  timezone?: string;
  initialView?: string;
  initialEvents?: ICalendarEvent[];
  events?: ICalendarEvent[];
  date?: Date;
  handleDateSelect?: (selectInfo: any) => void;
  renderEventContent?: (eventInfo: any) => void;
  handleEventClick?: (clickInfo: any) => void;
}

const event = [
  {
    title: 'All Day Event',
    start: '2021-12-01',
  },
  {
    title: 'Long Event',
    start: '2021-12-07',
    end: '2021-12-10',
  },
  {
    groupId: '999',
    title: 'Repeating Event',
    start: '2021-12-09T16:00:00+00:00',
  },
  {
    groupId: '999',
    title: 'Repeating Event',
    start: '2021-12-16T16:00:00+00:00',
  },
  {
    title: 'Conference',
    start: '2021-12-06',
    end: '2021-12-08',
    color: '#98FB98',
    textColor: 'black',
  },
  {
    title: 'Meeting',
    start: '2021-12-07T10:30:00+00:00',
    end: '2021-12-07T12:30:00+00:00',
    color: 'black',
    display: 'block',
    extendedProps: {
      name: 'Dhruvil shah',
    },
  },
  {
    title: 'Lunch',
    start: '2021-12-08T12:00:00+00:00',
    end: '2021-12-08T13:00:00+00:00',
    color: '#D3D3D3',
    display: 'block',
    textColor: 'black',
    extendedProps: {
      isLunchTime: true,
    },
  },
];

const Calendar: React.FC<IFullCalendarProps> = ({
  timezone,
  initialView,
  date,
  initialEvents,
  events,
  handleDateSelect,
  handleEventClick,
}) => {
  const [calender, setCalender] = React.useState({
    weekendsVisible: true,
    currentEvents: [],
    initialEvents: 'dayGridMonth',
  });

  const renderEventContent = (eventInfo: any) => {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <label>
            {eventInfo.event.title} {eventInfo.timeText && `(${eventInfo.timeText})`}
          </label>

          {calender.initialEvents !== 'dayGridMonth' && (
            <div style={{ paddingLeft: '20px' }}>
              <button>Call</button>
            </div>
          )}
        </div>
        {calender.initialEvents === 'timeGridDay' && (
          <div>
            <p>Day Wise Event</p>
          </div>
        )}
      </>
    );
  };

  const calendarRef = React.useRef<any>(null);
  // const handleEvents = events => {
  //   setCalender({
  //     ...calender,
  //     currentEvents: events,
  //   });
  // };

  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '00:00',
    endTime: '24:00',
  };

  const changeState = (view: any) => {
    setCalender({ ...calender, initialEvents: view });
    const calendarApi = calendarRef?.current?.getApi();
    calendarApi.changeView(view);
  };

  // React.useEffect(() => {
  //   const calendarApi = calendarRef.current.getApi();

  //   calendarApi.gotoDate(date ? date : new Date());
  // }, [date]);

  return (
    <>
      <button onClick={() => changeState('dayGridMonth')}>Month</button>
      <button onClick={() => changeState('timeGridWeek')}>Week</button>
      <button onClick={() => changeState('timeGridDay')}>Day</button>
      <Calender
        ref={calendarRef}
        timeZone={timezone ? timezone : 'local'}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialEvents={calender.initialEvents}
        events={event}
        // allDaySlot={false}
        // initialEvents={[
        //   // { title: 'Jigar Patel', value: '2021-06-10' },
        //   // { title: 'Jigar Patel', value: '2021-06-10T17:40:00' },
        //   { title: 'Jigar', start: new Date('2021-06-10T17:30:00Z'), end: new Date('2021-06-10T18:30:00Z') },
        //   { title: 'Event', start: new Date('2021-07-02T17:40:00Z'), end: new Date('2021-07-02T18:40:00Z') },
        // ]}
        initialView={initialView}
        editable={true}
        businessHours={businessHours}
        eventConstraint="businessHours"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={calender.weekendsVisible}
        select={handleDateSelect}
        // slotDuration="00:10"
        eventContent={renderEventContent}
        eventClick={e => !e.event.extendedProps.isLunchTime && window.alert(e.event.title)}
      />
    </>
  );
};
export default Calendar;
