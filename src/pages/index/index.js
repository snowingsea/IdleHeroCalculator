//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    events: [
      {
        name: '枫叶小屋🍁',
        free: 100,
        startTime: new Date('2018-11-09').getTime(),
        endTime: new Date('2018-11-16').getTime(),
        image: '/images/maple_leaf_cottage.jpg',
      },
    ],
    currentEvent: null,
    millisecondsInDay: 1000 * 60 * 60 * 24,
    total: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let last = null;
    this.data.events.forEach((event) => {
      const now = new Date().getTime();
      if (now < event.startTime) {
        return;
      }
      if (last === null || last.endTime < event.endTime) {
        last = event;
      }
      if (now <= event.endTime) {
        this.setData({ 'currentEvent': event });
      }
    });
    if (this.data.currentEvent === null) {
      this.setData({ 'currentEvent': last });
    }
    if (this.data.currentEvent) {
      wx.setNavigationBarTitle({
        title: this.data.currentEvent.name,
      });
    }
    console.log('当前活动信息：', this.data.currentEvent);
  },
  obtain: function(e) {
    const { currentEvent, millisecondsInDay } = this.data;
    if (!currentEvent) {
      return;
    }
    const { free, startTime, endTime } = currentEvent;
    const now = new Date().getTime();
    const { value } = e.detail;
    let total = value;
    if (now <= endTime) {
      const timePassed = now - startTime;
      const timeTotal = endTime - startTime;
      const days = Math.ceil(timePassed / millisecondsInDay);
      const freeTotal = free * Math.ceil(timeTotal / millisecondsInDay);
      if (value > days * free) {
        total = (value - days * free) * timeTotal / timePassed + freeTotal;
      }
    }
    this.setData({ 'total': Math.ceil(total) });
  }
})
