let locationCenter = [
    {
        code: 11680,
        state: "서울특별시",
        city: "강남구",
        X: 127.0629852,
        Y: 37.49664389,
    },
    {
        code: 11740,
        state: "서울특별시",
        city: "강동구",
        X: 127.1470118,
        Y: 37.55045024,
    },
    {
        code: 11305,
        state: "서울특별시",
        city: "강북구",
        X: 127.011189,
        Y: 37.64347391,
    },
    {
        code: 11500,
        state: "서울특별시",
        city: "강서구",
        X: 126.822807,
        Y: 37.56123543,
    },
    {
        code: 11620,
        state: "서울특별시",
        city: "관악구",
        X: 126.9453372,
        Y: 37.46737569,
    },
    {
        code: 11215,
        state: "서울특별시",
        city: "광진구",
        X: 127.0857435,
        Y: 37.54670608,
    },
    {
        code: 11530,
        state: "서울특별시",
        city: "구로구",
        X: 126.8563006,
        Y: 37.49440543,
    },
    {
        code: 11545,
        state: "서울특별시",
        city: "금천구",
        X: 126.9008202,
        Y: 37.46056756,
    },
    {
        code: 11350,
        state: "서울특별시",
        city: "노원구",
        X: 127.0750347,
        Y: 37.65251105,
    },
    {
        code: 11320,
        state: "서울특별시",
        city: "도봉구",
        X: 127.0323688,
        Y: 37.66910208,
    },
    {
        code: 11230,
        state: "서울특별시",
        city: "동대문구",
        X: 127.0548481,
        Y: 37.58195655,
    },
    {
        code: 11590,
        state: "서울특별시",
        city: "동작구",
        X: 126.9516415,
        Y: 37.49887688,
    },
    {
        code: 11440,
        state: "서울특별시",
        city: "마포구",
        X: 126.90827,
        Y: 37.55931349,
    },
    {
        code: 11410,
        state: "서울특별시",
        city: "서대문구",
        X: 126.9390631,
        Y: 37.57778531,
    },
    {
        code: 11290,
        state: "서울특별시",
        city: "성북구",
        X: 127.0175795,
        Y: 37.6057019,
    },
    {
        code: 11710,
        state: "서울특별시",
        city: "송파구",
        X: 127.115295,
        Y: 37.50561924,
    },
    {
        code: 11470,
        state: "서울특별시",
        city: "양천구",
        X: 126.8554777,
        Y: 37.52478941,
    },
    {
        code: 11560,
        state: "서울특별시",
        city: "영등포구",
        X: 126.9101695,
        Y: 37.52230829,
    },
    {
        code: 11170,
        state: "서울특별시",
        city: "용산구",
        X: 126.979907,
        Y: 37.53138497,
    },
    {
        code: 11380,
        state: "서울특별시",
        city: "은평구",
        X: 126.9270229,
        Y: 37.61921128,
    },
    {
        code: 11140,
        state: "서울특별시",
        city: "중구",
        X: 126.9959681,
        Y: 37.56014356,
    },
    {
        code: 11260,
        state: "서울특별시",
        city: "중랑구",
        X: 127.0928803,
        Y: 37.59780259,
    },
];

let STARTINDEX = 1;
let ENDINDEX = 1000;

let getBike = () => {
    let request = new XMLHttpRequest();
    let url =
        "https://seoul-where-is-bike.herokuapp.com/" +
        `http://openapi.seoul.go.kr:8088/7365526845776e733736506f757876/json/bikeList/${STARTINDEX}/${ENDINDEX}/`;
    request.open("GET", url);
    request.onload = () => {
        if (request.readyState === 4 && request.status === 200) {
            updateBike(request.responseText);
            return true;
        } else {
            return false;
        }
    };
    request.send(null);
};
getBike();

let totalBikes = {
    list_total_count: 0,
    row: [],
};

let updateBike = (responseText) => {
    let bikesData = JSON.parse(responseText);
    bikesData = bikesData.rentBikeStatus;
    bikesDataLength = bikesData.list_total_count;
    for (let i = 0; i < bikesDataLength; i++) {
        let bike = bikesData.row[i];
        totalBikes.row.push({
            rackTotCnt: bike.rackTotCnt,
            stationName: bike.stationName,
            parkingBikeTotCnt: bike.parkingBikeTotCnt,
            shared: bike.shared,
            stationLatitude: bike.stationLatitude,
            stationLongitude: bike.stationLongitude,
            stationId: bike.stationId,
        });
    }
    totalBikes.list_total_count += bikesDataLength;
    if (bikesDataLength == 1000) {
        STARTINDEX = ENDINDEX + 1;
        ENDINDEX = ENDINDEX + 1000;
        getBike();
        return;
    }
    // 모든 자전거 데이터 저장 완료.

    // 맵 제작 시작
    createMap(totalBikes);
};
let createMap = (totalBikes) => {
    let bikesLength = totalBikes.list_total_count;
    let bikesArr = totalBikes.row;

    let map = new kakao.maps.Map(
        document.getElementById("map"), //
        (mapOption = {
            center: new kakao.maps.LatLng(37.551914, 126.991851), // 서울 중심지 좌표
            level: 8, // 지도의 확대 레벨 1(확대) ~ 3(기본값) ~ 14(축소)
        })
    );
    map.setMaxLevel(8); // 축소 상한

    // 맵 컨트롤러 생성
    map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

    // copyright 위치 변경
    map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);

    // 마커 클러스터러
    let clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        gridSize: 50,
        minLevel: 1,
        minClusterSize: 1,
        disableClickZoom: true,
        clickable: false,
    });

    let markers = bikesArr.map((bike) => {
        return new kakao.maps.Marker({
            position: new kakao.maps.LatLng(bike.stationLatitude, bike.stationLongitude),
        });
    });
    for (let i = 0; i < bikesLength; i++) {
        let marker = markers[i];
        let bike = bikesArr[i];
        marker.bikeIndex = i;
        marker.parkingBikeTotCnt = bike.parkingBikeTotCnt;
        marker.rackTotCnt = bike.rackTotCnt;
        marker.stationName = bike.stationName.replace(/[0-9]+\.\ ?/, "");
        marker.shared = bike.shared;
        marker.stationLatitude = bike.stationLatitude;
        marker.stationLongitude = bike.stationLongitude;
        marker.stationId = bike.stationId;
    }
    kakao.maps.event.addListener(clusterer, "clustered", (clusters) => {
        let listGroup = document.getElementById("location-list");
        listGroup.replaceChildren();
        let items = [];
        for (let i = 0; i < clusters.length; i++) {
            let cluster = clusters[i]; // 화면에 있는 클러스터들 중에 하나
            let customCluster = cluster.getClusterMarker(); // 한 클러스터의 커스텀 오버레이
            cluster.id = `cluster${i}`;
            items.push(cluster);
            let clusterMarkers = cluster.getMarkers();

            let bikeCount = 0; // 클러스터 내부에 있는 마커에 대해 남은 bike 수 count
            for (let j = 0; j < cluster.getSize(); j++) {
                let clusterMarker = clusterMarkers[j]; // 한 클러스터 내부에 있는 마커들중 하나

                bikeCount += Number(clusterMarker.parkingBikeTotCnt); // 마커 하나를 통과할때마다 자전거수 증가
                // 아래는 화면에 있는 모든 마커로 이루어진 리스트를 제작후 자식으로 편입
                let bikeList = document.createElement("li");
                bikeList.setAttribute("class", "list-group-item");
                bikeList.setAttribute("bikeIndex", clusterMarker.bikeIndex);
                bikeList.setAttribute(
                    "parkingBikeTotCnt",
                    clusterMarker.parkingBikeTotCnt
                );
                bikeList.setAttribute("rackTotCnt", clusterMarker.rackTotCnt);
                bikeList.setAttribute("stationName", clusterMarker.stationName);
                bikeList.setAttribute(
                    "parkingBikeTotCnt",
                    clusterMarker.parkingBikeTotCnt
                );
                bikeList.setAttribute("shared", clusterMarker.shared);
                bikeList.setAttribute("stationLatitude", clusterMarker.stationLatitude);
                bikeList.setAttribute("stationLongitude", clusterMarker.stationLongitude);
                bikeList.setAttribute("stationId", clusterMarker.stationId);
                bikeList.addEventListener("click", (event) => {
                    let moveLatLng = new kakao.maps.LatLng(
                        event.currentTarget.getAttribute("stationLatitude"),
                        event.currentTarget.getAttribute("stationLongitude")
                    );
                    map.setCenter(moveLatLng);
                    if (map.getLevel() < 6) {
                        map.setLevel(map.getLevel() - 1);
                    } else {
                        map.setLevel(5);
                    }
                });
                bikeList.innerHTML = `장소: ${clusterMarker.stationName}<br>
                남은자전거: ${
                    clusterMarker.parkingBikeTotCnt
                }<span class="tab">&#9;</span> 거치대개수: ${clusterMarker.rackTotCnt}
                <br>
                위도: ${
                    Math.floor(clusterMarker.stationLatitude * 1000000) / 1000000
                }<span class="tab">&#9;</span> 경도: ${
                    Math.floor(clusterMarker.stationLongitude * 1000000) / 1000000
                }`;
                listGroup.appendChild(bikeList);
            }
            // 여기서부터는 클러스터 하나에 대한 이야기
            // 클러스터를 갯수에 따라 색상을 직접 정해줄 겁니다.
            let div = document.createElement("div");
            div.setAttribute("id", `cluster${i}`);
            if (bikeCount < 5) {
                div.setAttribute("class", "stop-dragging circle01");
                div.innerText = bikeCount;
            } else if (bikeCount < 10) {
                div.setAttribute("class", "stop-dragging circle02");
                div.innerText = bikeCount;
            } else if (bikeCount < 30) {
                div.setAttribute("class", "stop-dragging circle03");
                div.innerText = "10+";
            } else {
                div.setAttribute("class", "stop-dragging circle04");
                div.innerText = "30+";
            }
            div.setAttribute("clusterLatitude", cluster.getCenter().getLat());
            div.setAttribute("clusterLongitude", cluster.getCenter().getLng());
            div.addEventListener("click", (event) => {
                // 클러스터를 클릭했을 경우
                // 리스트를 싹다 날린다음 그 클러스터의 내용만 가져오기.
                listGroup.replaceChildren();
                let currentCluster;
                for (let k = 0; k < items.length; k++) {
                    if (event.currentTarget.getAttribute("id") == items[k].id) {
                        currentCluster = items[k];
                        break;
                    }
                }
                // 현재 currentCluster는 선택된 cluster
                let currentMarkers = currentCluster.getMarkers();
                for (let k = 0; k < currentCluster.getSize(); k++) {
                    let marker = currentMarkers[k];
                    let bikeList = document.createElement("li");
                    bikeList.setAttribute("class", "list-group-item");
                    bikeList.setAttribute("bikeIndex", marker.bikeIndex);
                    bikeList.setAttribute("parkingBikeTotCnt", marker.parkingBikeTotCnt);
                    bikeList.setAttribute("rackTotCnt", marker.rackTotCnt);
                    bikeList.setAttribute("stationName", marker.stationName);
                    bikeList.setAttribute("parkingBikeTotCnt", marker.parkingBikeTotCnt);
                    bikeList.setAttribute("shared", marker.shared);
                    bikeList.setAttribute("stationLatitude", marker.stationLatitude);
                    bikeList.setAttribute("stationLongitude", marker.stationLongitude);
                    bikeList.setAttribute("stationId", marker.stationId);
                    bikeList.addEventListener("click", (event) => {
                        let moveLatLng = new kakao.maps.LatLng(
                            event.currentTarget.getAttribute("stationLatitude"),
                            event.currentTarget.getAttribute("stationLongitude")
                        );
                        map.setCenter(moveLatLng);
                        if (map.getLevel() < 6) {
                            map.setLevel(map.getLevel() - 1);
                        } else {
                            map.setLevel(5);
                        }
                    });
                    bikeList.innerHTML = `장소: ${marker.stationName}<br>
                    남은자전거: ${marker.parkingBikeTotCnt.padStart(
                        5
                    )}<span class="tab">&#9;</span> 거치대개수: ${marker.rackTotCnt.padStart(
                        5
                    )}
                    <br>
                    위도: ${
                        Math.floor(marker.stationLatitude * 1000000) / 100000
                    }<span class="tab">&#9;</span> 경도: ${
                        Math.floor(marker.stationLongitude * 1000000) / 1000000
                    }`;
                    listGroup.appendChild(bikeList);
                }
            });
            customCluster.setContent(div);
        }
        let mapLoading = document.getElementById("map-loading-div");
        if (mapLoading) {
            let loadingElement = document.getElementById("map-div");
            loadingElement.removeChild(mapLoading);
        }
    });

    clusterer.addMarkers(markers);
    let myLocationButton = document.getElementById("myLocationButton");
    myLocationButton.addEventListener("click", (event) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let userLat = position.coords.latitude;
                let userLng = position.coords.longitude;
                map.panTo(new kakao.maps.LatLng(userLat, userLng));
            });
        }
    });
    let searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", (event) => {
        let value_str = document.getElementById("placeSelected");
        let location = (i) => {
            return new kakao.maps.LatLng(locationCenter[i].Y, locationCenter[i].X);
        };
        let centerLatLng;
        switch (value_str.options[value_str.selectedIndex].value) {
            case "nn":
                alert("선택하지 않았습니다. 다시 입력하세요!");
                break;
            case "gn":
                centerLatLng = location(0);
                break;
            case "gd":
                centerLatLng = location(1);
                break;
            case "gb":
                centerLatLng = location(2);
                break;
            case "gs":
                centerLatLng = location(3);
                break;
            case "ga":
                centerLatLng = location(4);
                break;
            case "gj":
                centerLatLng = location(5);
                break;
            case "gr":
                centerLatLng = location(6);
                break;
            case "gc":
                centerLatLng = location(7);
                break;
            case "no":
                centerLatLng = location(8);
                break;
            case "db":
                centerLatLng = location(9);
                break;
            case "dd":
                centerLatLng = location(10);
                break;
            case "dj":
                centerLatLng = location(11);
                break;
            case "mp":
                centerLatLng = location(12);
                break;
            case "sd":
                centerLatLng = location(13);
                break;
            case "sb":
                centerLatLng = location(14);
                break;
            case "sp":
                centerLatLng = location(15);
                break;
            case "yc":
                centerLatLng = location(16);
                break;
            case "yd":
                centerLatLng = location(17);
                break;
            case "ys":
                centerLatLng = location(18);
                break;
            case "yp":
                centerLatLng = location(19);
                break;
            case "jg":
                centerLatLng = location(20);
                break;
            case "jr":
                centerLatLng = location(21);
                break;
        }
        map.setCenter(centerLatLng);
        map.setLevel(7);
    });
    let resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", (event) => {
        map.setLevel(10);
        map.setCenter(new kakao.maps.LatLng(37.551914, 126.991851));
    });
};
